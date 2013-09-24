###
# sass-watch.command
# Makes use of SASS (http://sass-lang.com/)
#
# Simply double-click the .command file...

cd "`dirname "$0"`"
cd ..
sass -g -l --watch css/sass:css/compiled
