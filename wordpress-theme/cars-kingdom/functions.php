<?php
/**
 * Cars Kingdom LTD theme bootstrap.
 *
 * - Registers CPTs: ck_car, ck_bike, ck_new_car, ck_review
 * - Registers taxonomies: ck_make, ck_city, ck_body
 * - Exposes REST API /wp-json/carskingdom/v1/{cars,bikes,newCars,reviews,posts,makes,cities}
 * - Elementor compatible (CPTs are editable with Elementor)
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'CK_VERSION', '1.0.0' );
require_once get_template_directory() . '/inc/post-types.php';
require_once get_template_directory() . '/inc/rest-api.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption' ) );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'elementor' );
	register_nav_menu( 'primary', __( 'Primary Menu', 'cars-kingdom' ) );
	add_image_size( 'ck-card', 800, 500, true );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'ck-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap', array(), null );
	wp_enqueue_style( 'ck-style', get_stylesheet_uri(), array(), CK_VERSION );
} );

// Let Elementor edit our custom post types.
add_filter( 'elementor_cpt_support', function ( $types ) {
	return array_unique( array_merge( (array) $types, array( 'page', 'post', 'ck_car', 'ck_bike', 'ck_new_car', 'ck_review' ) ) );
} );
add_action( 'init', function () {
	$types = get_option( 'elementor_cpt_support', array( 'page', 'post' ) );
	$types = array_unique( array_merge( (array) $types, array( 'ck_car', 'ck_bike', 'ck_new_car', 'ck_review' ) ) );
	update_option( 'elementor_cpt_support', $types );
} );
