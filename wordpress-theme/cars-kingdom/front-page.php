<?php
/** Front page: editable with Elementor if a static page is set, otherwise a default hero + latest cars. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
if ( 'page' === get_option( 'show_on_front' ) && have_posts() ) { get_template_part( 'index' ); return; }
get_header(); ?>
<section class="ck-hero"><div class="ck-container">
	<h1>Find your dream car with Cars Kingdom LTD</h1>
	<p>Lahore used cars, new cars, car reviews and auto parts.</p>
	<a class="ck-btn" href="<?php echo esc_url( get_post_type_archive_link( 'ck_car' ) ); ?>">Browse Used Cars in Lahore</a>
</div></section>
<main class="ck-container">
	<h2>Featured Cars</h2>
	<div class="ck-grid">
	<?php $q = new WP_Query( array( 'post_type' => 'ck_car', 'posts_per_page' => 6 ) );
	while ( $q->have_posts() ) : $q->the_post(); ?>
		<article class="ck-card">
			<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'ck-card' ); ?></a>
			<div class="ck-card-body"><h3><?php the_title(); ?></h3></div>
		</article>
	<?php endwhile; wp_reset_postdata(); ?>
	</div>
</main>
<?php get_footer();
