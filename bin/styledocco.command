###
# styledocco.command
# Makes use of Styldocco (http://jacobrask.github.com/styledocco/)
# to generate documentation for your CSS
# 
# In order to work you must have installed:
# - Node
# - Styledocco (sudo npm install -g styldocco)
#
# Simply double-click the .command file...

cd "`dirname "$0"`"
cd ..
styledocco -o docs css/sass/
