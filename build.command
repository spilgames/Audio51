cd "`dirname "$0"`"
mdpress -s spilgames present.md
cp -R *.src present
cp -R samples present
mdpress -s spilgames audiotag.md
cp -R *.src audiotag
cp -R samples audiotag
