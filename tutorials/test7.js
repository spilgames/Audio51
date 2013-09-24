var tag = ( function( config ) {
    var ctx = getContext(),
        sound = ctx.createOscillator(),
        gain = ctx.createGain(),
        analyzer = ctx.createAnalyser(),
        audionode, t = 0,
        last = Date.now(),
        testcase = function() {
            if (t<5) {
            } else if(t<10) {
                gain.gain.value = 0.5;
            } else  if (t < 15) {
                gain.gain.value = 0.25;
            } else if (t < 20) {
                gain.gain.value = 0.001;
            } else {
                sound.stop(0);
                sound.disconnect();
            }
        },
        getVolumeAverage = function() {
            var values = 0,
                array =  new Uint8Array(analyzer.frequencyBinCount),
                length, average, i;

            analyzer.getByteFrequencyData(array);
            length = array.length;

            // get all the frequency amplitudes
            for (i = 0; i < length; ++i) {
                values += array[i];
            }

            average = values / length;
            return average;
        },
        report = function() {
            var now = Date.now();
            if ( now - last >= 350 ) {
                ++t;
                last = now;
                console.log(t, ctx.activeSourceCount, getVolumeAverage());
                testcase();
            }
            if (t < 30) requestAnimationFrame( report );
        };

    analyzer.connect(ctx.destination);
    analyzer.smoothingTimeConstant = 0;
    gain.connect(analyzer);
    sound.connect(gain);
    sound.start(0);
    console.log(ctx.activeSourceCount, getVolumeAverage());

    report();

}(
));