<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', function () {
	$types = array(
		'ck_car'     => array( 'Used Cars', 'Used Car', 'cars' ),
		'ck_bike'    => array( 'Used Bikes', 'Used Bike', 'bikes' ),
		'ck_new_car' => array( 'New Cars', 'New Car', 'new-cars' ),
		'ck_review'  => array( 'Reviews', 'Review', 'reviews' ),
	);
	foreach ( $types as $slug => $l ) {
		register_post_type( $slug, array(
			'labels'       => array( 'name' => $l[0], 'singular_name' => $l[1] ),
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => $l[2],
			'rewrite'      => array( 'slug' => $l[2] ),
			'menu_icon'    => 'dashicons-car',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'elementor' ),
		) );
	}
	$vehicle = array( 'ck_car', 'ck_bike', 'ck_new_car' );
	register_taxonomy( 'ck_make', $vehicle, array( 'label' => 'Makes', 'hierarchical' => true, 'show_in_rest' => true ) );
	register_taxonomy( 'ck_city', array( 'ck_car', 'ck_bike' ), array( 'label' => 'Cities', 'hierarchical' => true, 'show_in_rest' => true ) );
	register_taxonomy( 'ck_body', array( 'ck_car', 'ck_new_car' ), array( 'label' => 'Body Types', 'hierarchical' => true, 'show_in_rest' => true ) );

	// Meta fields exposed to REST.
	$fields = array( 'price' => 'number', 'year' => 'integer', 'mileage_km' => 'number', 'engine_cc' => 'number',
		'fuel_type' => 'string', 'transmission' => 'string', 'color' => 'string', 'assembly' => 'string',
		'version' => 'string', 'model' => 'string', 'variant' => 'string', 'reviewer' => 'string',
		'rating' => 'number', 'vehicle' => 'string', 'features' => 'string' );
	foreach ( array( 'ck_car', 'ck_bike', 'ck_new_car', 'ck_review' ) as $pt ) {
		foreach ( $fields as $key => $type ) {
			register_post_meta( $pt, $key, array( 'type' => $type, 'single' => true, 'show_in_rest' => true ) );
		}
	}
} );
