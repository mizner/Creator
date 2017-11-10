# Creator
## Why?
- This was creator for folks at my local WordPress Meetup group to get them started using some modern frontend developer tooling.
## Note
- This is for local development of a WordPress theme using something like:
    - [Local by Flywheel (reccomended)](https://local.getflywheel.com/) 
    - [MAMP](https://www.mamp.info)
    - [ServerPress](https://serverpress.com/get-desktopserver)
    - [VVV (somewhat complex)](https://github.com/Varying-Vagrant-Vagrants/VVV)
    - [Scotchbox (somewhat complex)](https://box.scotch.io/)
## Features
- Sass (`.scss`)
- Autoprefixer (automatically creates css rules for `IE10+` compatibility)
- Modern JavaScript ES2015+ (compiles to ES5 for `IE10+` compatibility)

## Get Started
- Open your terminal, `cd` into your themes directory
    * (e.g. `cd ~/Local\ Sites/project/app/public/wp-content/themes`)
- Clone the repo `git clone https://github.com/mizner/Creator`
- Run `yarn install` (or `npm` alternatives) ... I highly recommend yarn.
- To build assets (css & javascript) run `gulp build`
    - **Note:** `.scss` files will pre-process to `.css` files output in the `/dist` folder
    - **Note:** All `.js` files get combined and minified to one file output in the `/dist` folder
- Open `gulpfile.js` and make sure `localUri` is changed from `http://wordpress.dev` to whatever you local site is e.g `localhost:8000`, `http://mysite.dev`, etc.
- Now the awesome part, run `gulp watch`
    - **Note:** This will open your browser to `localhost:3000` (probably) and watch for changes you make to theme files.  
    - **Note:** `.js` and `.php` files with cause the page to reload
    - **Awesome Note:** `.scss` files changes will inject the new sites into the site without reloading (well... 99% of the time).
- Clean up the files in the `assets/scripts` (there's just some simple code inside as an example)
- Have fun writing `.scss` and watching your changes happen immediately
    
## What's different from the regular underscores theme?
- The `style.css` file is only being loaded on the backend to allow it to be activated.  No `css` changes here will effect the frontend.
- `functions.php` (starting at line `123`) has been lightly modified to enqueue 3 new files 
    - Our main `css` file that is dynamically created via `gulp`
    - Our main `js` file that is dynamically created via `gulp`
    - A WooCommerce `css` file (if WooCommerce exists) that is dynamically created via `gulp`
    
    
## How to use the tools here in your existing theme/child-theme:
- Copy `package.json` and `gulpfile.js` into your existing theme.
- Create a `assets` folder with two subdirectory folders inside `scripts` and `style` 
- Create a `main.js` file in the `scripts` folder
- Create a `main.scss` file in the `style` folder
- Run `yarn install` after you've `cd` into the theme directory
- Make sure you've changed the `url`
- Modify your `functions.php` to enqueue the `css` and `js` files

**Example:** 
```$php
function gulp_enqueues() {
    $childtheme_css = get_stylesheet_directory_uri() . '/dist/main.min.css'; // Use if not a child theme 
    $theme_css = get_template_directory_uri() . '/dist/main.min.css'; // Use if not a child theme
    wp_enqueue_style( 'gulp-style', $theme_css );

    $childtheme_js = get_stylesheet_directory_uri() . '/dist/main.min.js'; // Use if not a child theme 
    $theme_js = get_template_directory_uri() . '/dist/main.min.js'; // Use if not a child theme
    wp_enqueue_script( 'gulp-script', $theme_js, [ 'jquery' ], '1.0', true );
}
add_action( 'wp_enqueue_scripts', 'gulp_enqueues' );
```
    