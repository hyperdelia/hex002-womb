(
    var numSources = 32;
    var nrt = true;

    var outBus = Bus.audio(s, numSources);
    var synths;

    // NRT support
    var totalDur = 30;
    var outputPath = thisProcess.nowExecutingPath +/+ "render" +/+ "output.wav",
    var options = ServerOptions.new;

    var loadSynthDefs = {
        SynthDef(\sine, {
            arg freq=440, lfoFreq=2, fbGain=1.5, atk=2, rel=4, amp=0.1, gate=1, out=0;

            var env = Env.asr(0.001, 1.0, 1).ar(Done.freeSelf, gate);
            var fb = LocalIn.ar(1);

            var lfo = SinOsc.ar(lfoFreq).range(0, 1);
            var sig = SinOsc.ar(freq, fb * lfo) * lfo;

            LocalOut.ar(LeakDC.ar(tanh(sig * fbGain)));

            sig = HPF.ar(sig, 30);
            Out.ar(out, sig * env * amp);
        }).load;

        SynthDef(\mainout, {
            var sig = outBus.ar();
            sig = HPF.ar(sig, 30);
            Out.ar(0, Splay.ar(sig));
        }).add;
    };

    synths = numSources.collect {arg i;
        var octaves = (3..7);

        Pbind(
            \instrument, \sine,
            \scale, Scale.lydian,
            \root, 2,
            \octave, octaves.wrapAt(i),
            \degree, i % 14,
            \db, -6,
            \fbGain, Pwhite(0.5, 2.5),
            \lfoFreq, (i+1) ** 0.725,
            \out, nrt.not.if((outBus.index + i), i),
            \dur, inf,
        );
    };

    synths = Ppar(synths);

    if (nrt.not) {
        s.waitForBoot {
            loadSynthDefs.();
            s.sync;
            Synth.tail(s, \mainout);
            s.sync;
            synths.play;

            CmdPeriod.doOnce {
                outBus.free;
            };
        }
    } {
        options.numOutputBusChannels = numSources;
        loadSynthDefs.();
        synths.render(
            outputPath,
            totalDur,
            44100,
            "WAV",
            "int24",
            options,
            action: {
                "Wrote output to %".format(outputPath).postln;
            }
        );
    }
)
