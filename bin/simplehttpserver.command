###
# simplehttpserver.command
# Makes use of 'SimpleHTTPServer' to serve your files as a webserver
# This should already be installed on an OSX machine, by default.
# You can view your project at http://localhost:8000/
# 
# Simply double-click the .command file...

cd "`dirname "$0"`"
cd ..
ifconfig en1|grep 'inet '|perl -pe 's/.*?([1-9.]+)+.*/open "http:\/\/$1:8000"/'|sh
python -m SimpleHTTPServer
