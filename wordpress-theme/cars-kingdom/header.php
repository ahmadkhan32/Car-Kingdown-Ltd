<?php if ( ! defined( 'ABSPATH' ) ) { exit; } ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="ck-header">
	<div class="ck-container">
		<a class="ck-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">👑 Cars <b>Kingdom</b> LTD</a>
		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'ck-menu', 'fallback_cb' => function () { ?>
			<ul class="ck-menu">
				<li><a href="<?php echo esc_url( get_post_type_archive_link( 'ck_car' ) ); ?>">Used Cars (Lahore)</a></li>
				<li><a href="<?php echo esc_url( get_post_type_archive_link( 'ck_new_car' ) ); ?>">New Cars</a></li>
				<li><a href="<?php echo esc_url( get_post_type_archive_link( 'ck_review' ) ); ?>">Car Reviews</a></li>
				<li><a href="<?php echo esc_url( home_url( '/sell/' ) ); ?>">Sell Your Car</a></li>
				<li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a></li>
			</ul>
		<?php } ) ); ?>
	</div>
</header>
