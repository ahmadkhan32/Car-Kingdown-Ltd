<?php
/** Default template: archives, search, blog and Elementor-built pages. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header(); ?>
<main class="ck-container">
<?php if ( have_posts() ) : ?>
	<?php if ( is_singular() ) : while ( have_posts() ) : the_post(); ?>
		<article <?php post_class(); ?>>
			<h1><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</article>
	<?php endwhile; else : ?>
		<?php if ( ! is_front_page() ) : ?><h1><?php the_archive_title(); ?></h1><?php endif; ?>
		<div class="ck-grid">
		<?php while ( have_posts() ) : the_post();
			$price = get_post_meta( get_the_ID(), 'price', true ); ?>
			<article class="ck-card">
				<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'ck-card' ); ?></a>
				<div class="ck-card-body">
					<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
					<?php if ( $price ) : ?><div class="ck-price">PKR <?php echo esc_html( number_format_i18n( (float) $price ) ); ?></div><?php endif; ?>
					<?php the_excerpt(); ?>
					<a class="ck-btn" href="<?php the_permalink(); ?>"><?php esc_html_e( 'View Details', 'cars-kingdom' ); ?></a>
				</div>
			</article>
		<?php endwhile; ?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php endif; ?>
<?php else : ?>
	<p><?php esc_html_e( 'Nothing found.', 'cars-kingdom' ); ?></p>
<?php endif; ?>
</main>
<?php get_footer();
