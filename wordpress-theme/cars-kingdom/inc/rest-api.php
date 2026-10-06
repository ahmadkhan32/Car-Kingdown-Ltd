<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Shape a post into the JSON structure the React app expects. */
function ck_format( WP_Post $p ) {
	$m   = fn( $k ) => ( $v = get_post_meta( $p->ID, $k, true ) ) !== '' ? $v : null;
	$num = fn( $k ) => ( $v = $m( $k ) ) !== null ? ( $v + 0 ) : null;
	$img = get_the_post_thumbnail_url( $p, 'large' );
	$term = function ( $tax ) use ( $p ) {
		$t = get_the_terms( $p, $tax );
		return ( $t && ! is_wp_error( $t ) ) ? $t[0]->name : null;
	};
	$cat = get_the_category( $p->ID );
	return array(
		'id'           => (string) $p->ID,
		'slug'         => $p->post_name,
		'title'        => get_the_title( $p ),
		'description'  => wp_strip_all_tags( $p->post_excerpt ?: $p->post_content ),
		'content'      => wp_strip_all_tags( $p->post_content ),
		'excerpt'      => wp_strip_all_tags( get_the_excerpt( $p ) ),
		'image'        => $img ?: null,
		'images'       => $img ? array( $img ) : array(),
		'make'         => $term( 'ck_make' ),
		'city'         => $term( 'ck_city' ),
		'body_type'    => $term( 'ck_body' ),
		'model'        => $m( 'model' ),
		'variant'      => $m( 'variant' ),
		'version'      => $m( 'version' ),
		'year'         => $num( 'year' ),
		'price'        => $num( 'price' ),
		'currency'     => 'PKR',
		'mileage_km'   => $num( 'mileage_km' ),
		'engine_cc'    => $num( 'engine_cc' ),
		'fuel_type'    => $m( 'fuel_type' ),
		'transmission' => $m( 'transmission' ),
		'color'        => $m( 'color' ),
		'assembly'     => $m( 'assembly' ),
		'features'     => $m( 'features' ) ? array_map( 'trim', explode( ',', $m( 'features' ) ) ) : array(),
		'vehicle'      => $m( 'vehicle' ),
		'reviewer'     => $m( 'reviewer' ) ?: get_the_author_meta( 'display_name', $p->post_author ),
		'rating'       => $num( 'rating' ),
		'text'         => wp_strip_all_tags( $p->post_content ),
		'author'       => get_the_author_meta( 'display_name', $p->post_author ),
		'date'         => get_the_date( 'c', $p ),
		'category'     => $cat ? $cat[0]->name : null,
		'tags'         => wp_list_pluck( get_the_tags( $p->ID ) ?: array(), 'name' ),
	);
}

/** Generic query handler with filtering + pagination. */
function ck_query( $post_type, WP_REST_Request $r ) {
	$per  = min( 50, max( 1, (int) ( $r['per_page'] ?: 6 ) ) );
	$page = max( 1, (int) ( $r['page'] ?: 1 ) );
	$args = array( 'post_type' => $post_type, 'post_status' => 'publish', 'posts_per_page' => $per, 'paged' => $page, 's' => $r['q'] ?: '' );
	$tax = array();
	foreach ( array( 'make' => 'ck_make', 'city' => 'ck_city', 'body' => 'ck_body' ) as $param => $taxonomy ) {
		if ( $r[ $param ] ) {
			$tax[] = array( 'taxonomy' => $taxonomy, 'field' => 'name', 'terms' => sanitize_text_field( $r[ $param ] ) );
		}
	}
	if ( $tax ) { $args['tax_query'] = $tax; }
	$meta = array();
	if ( $r['minPrice'] ) { $meta[] = array( 'key' => 'price', 'value' => (float) $r['minPrice'], 'compare' => '>=', 'type' => 'NUMERIC' ); }
	if ( $r['maxPrice'] ) { $meta[] = array( 'key' => 'price', 'value' => (float) $r['maxPrice'], 'compare' => '<=', 'type' => 'NUMERIC' ); }
	foreach ( array( 'year', 'model', 'fuel' => 'fuel_type', 'transmission' ) as $k => $key ) {
		$param = is_int( $k ) ? $key : $k;
		if ( $r[ $param ] ) { $meta[] = array( 'key' => $key, 'value' => sanitize_text_field( $r[ $param ] ) ); }
	}
	if ( $meta ) { $args['meta_query'] = $meta; }

	$q = new WP_Query( $args );
	return array(
		'items'      => array_map( 'ck_format', $q->posts ),
		'total'      => (int) $q->found_posts,
		'totalPages' => max( 1, (int) $q->max_num_pages ),
		'page'       => $page,
	);
}

add_action( 'rest_api_init', function () {
	// CORS so the Vercel-hosted React app can call this site.
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function ( $v ) {
		header( 'Access-Control-Allow-Origin: *' );
		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, Nonce, Authorization' );
		header( 'Access-Control-Expose-Headers: Nonce, X-WP-Total' );
		return $v;
	} );

	$map = array( 'cars' => 'ck_car', 'newCars' => 'ck_new_car', 'reviews' => 'ck_review', 'posts' => 'post' );
	foreach ( $map as $route => $pt ) {
		register_rest_route( 'carskingdom/v1', "/$route", array(
			'methods' => 'GET', 'permission_callback' => '__return_true',
			'callback' => fn( $r ) => ck_query( $pt, $r ),
		) );
		register_rest_route( 'carskingdom/v1', "/$route/(?P<id>[\w-]+)", array(
			'methods' => 'GET', 'permission_callback' => '__return_true',
			'callback' => function ( $r ) use ( $pt ) {
				$id = $r['id'];
				$p  = is_numeric( $id ) ? get_post( (int) $id ) : get_page_by_path( $id, OBJECT, $pt );
				if ( ! $p || $p->post_type !== $pt || 'publish' !== $p->post_status ) {
					return new WP_Error( 'not_found', 'Not found', array( 'status' => 404 ) );
				}
				return ck_format( $p );
			},
		) );
	}
	register_rest_route( 'carskingdom/v1', '/makes', array( 'methods' => 'GET', 'permission_callback' => '__return_true',
		'callback' => fn() => wp_list_pluck( get_terms( array( 'taxonomy' => 'ck_make', 'hide_empty' => false ) ), 'name' ) ) );
	register_rest_route( 'carskingdom/v1', '/cities', array( 'methods' => 'GET', 'permission_callback' => '__return_true',
		'callback' => fn() => wp_list_pluck( get_terms( array( 'taxonomy' => 'ck_city', 'hide_empty' => false ) ), 'name' ) ) );
	register_rest_route( 'carskingdom/v1', '/bodies', array( 'methods' => 'GET', 'permission_callback' => '__return_true',
		'callback' => fn() => wp_list_pluck( get_terms( array( 'taxonomy' => 'ck_body', 'hide_empty' => false ) ), 'name' ) ) );

	// Allow users to list used cars via REST API
	register_rest_route( 'carskingdom/v1', '/cars', array(
		'methods' => 'POST',
		'permission_callback' => '__return_true',
		'callback' => function ( WP_REST_Request $r ) {
			$title = sanitize_text_field( $r->get_param( 'title' ) );
			if ( ! $title ) {
				return new WP_Error( 'missing_title', 'Title is required', array( 'status' => 400 ) );
			}
			$pid = wp_insert_post( array(
				'post_title'   => $title,
				'post_type'    => 'ck_car',
				'post_status'  => 'publish',
				'post_content' => sanitize_textarea_field( $r->get_param( 'description' ) ?: '' ),
			) );
			if ( is_wp_error( $pid ) ) {
				return $pid;
			}
			$fields = array( 'price', 'year', 'mileage_km', 'engine_cc', 'fuel_type', 'transmission', 'color', 'assembly', 'model', 'version', 'features' );
			foreach ( $fields as $f ) {
				if ( $r->has_param( $f ) ) {
					update_post_meta( $pid, $f, sanitize_text_field( (string) $r->get_param( $f ) ) );
				}
			}
			if ( $r->get_param( 'make' ) ) {
				wp_set_object_terms( $pid, sanitize_text_field( $r->get_param( 'make' ) ), 'ck_make' );
			}
			if ( $r->get_param( 'city' ) ) {
				wp_set_object_terms( $pid, sanitize_text_field( $r->get_param( 'city' ) ), 'ck_city' );
			}
			if ( $r->get_param( 'body_type' ) ) {
				wp_set_object_terms( $pid, sanitize_text_field( $r->get_param( 'body_type' ) ), 'ck_body' );
			}
			return ck_format( get_post( $pid ) );
		},
	) );
} );
