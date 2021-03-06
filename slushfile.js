var gulp     = require( 'gulp' ),
    install  = require( 'gulp-install' ),
    conflict = require( 'gulp-conflict' ),
    template = require( 'gulp-template' ),
    inquirer = require( 'inquirer' ),
    slug     = require( 'slug' ),
    exec     = require( 'child_process' ).exec;

gulp.task( 'default', function( done ) {
  error_empty = function( answer ) {
    return answer.replace( / /g, '' ) !== ''
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'project',
      message: 'Project\'s name?',
      validate: error_empty
    },
    {
      type: 'input',
      name: 'client',
      message: 'Client\'s name?',
      validate: error_empty
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ], function( answers ) {

      var cmd = 'git config user.name && git config user.email';
      exec( cmd, function( err, stdout ) {
        data = stdout.split( '\n' );
        answers.author = data[ 0 ] + ' <' + data[ 1 ] + '>';
        answers.short_name = slug( answers.client.toLowerCase() ) + '_' + slug( answers.project.toLowerCase() );

        if ( !answers.moveon ) {
          return done();
        }
        gulp.src( __dirname + '/template/**', { dot:true } )
          .pipe( template( answers ) )
          .pipe( conflict( './' ) )
          .pipe( gulp.dest( './' ) )
          .pipe( install() )
          .on( 'finish', function() {
            done();
          });
      });
    });
});
