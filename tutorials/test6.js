var tag = ( function( config ) {
    var sound = new Audio( "samples/policesiren2.ogg" ),
        ctx = getContext(),
        gain = ctx.createGain(),
        analyzer = ctx.createAnalyser(),
        audionode, t = 0,
        last = Date.now(),
        testcase = function() {
            if (t<5) {
                sound.play();
            } else if(t<10) {
                gain.gain.value = 0.25;
            } else {
                gain.gain.value = 0;
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
    console.log(ctx.activeSourceCount, getVolumeAverage());

    sound.addEventListener("canplay", function() {
        console.log("Connecting to context");
        audionode = getContext().createMediaElementSource( sound );
        audionode.connect(gain);
    });

    report();

}(
));