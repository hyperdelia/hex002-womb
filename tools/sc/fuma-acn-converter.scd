(
    var thisPath = PathName(PathName(thisProcess.nowExecutingPath).absolutePath).pathOnly +/+ "acn";

    var duration, decoder, sampleRate, headerFormat, sampleFormat, numChannels;
    var offset = 0.1;

    var score = Score.new;

    // get a buffer number from the server
    var bufnum = Server.default.bufferAllocator.alloc(1);

    var inputPath = "~/audio/atk-sounds-1.0.0/b-format/Leonard-Fireworks.wav".standardizePath;
    var outputPath;

    SoundFile.use(inputPath, {arg sf;
        headerFormat = sf.headerFormat;
        sampleFormat = sf.sampleFormat;
        sampleRate = sf.sampleRate;
        numChannels = sf.numChannels;
        duration = sf.duration;
    });

    outputPath = thisPath +/+ PathName(inputPath).fileNameWithoutExtension ++ "-acn." ++ headerFormat.toLower;

    decoder = FoaDecoderMatrix.newAmbix1;

    SynthDef(\fuma_acn_converter, {arg buf;
        var src = PlayBuf.ar(numChannels, buf, BufRateScale.kr(buf));
        var sig = FoaDecode.ar(src, decoder);
        Out.ar(0, sig);
    }).load;

    // load buffer to nrt server instance
    score.add(
        [
            0.0,
            [ \b_allocRead, bufnum, inputPath, 0, 0 ],
            [ \s_new, \fuma_acn_converter, 1001, 0, 1, \buf, bufnum ]
        ],
    );

    score.add([ duration, [ \n_free, 1001 ] ]);
    score.add([ offset + duration, [ \b_free, bufnum ] ]);
    score.add([ (2*offset) + duration, [\c_set, 0, 0] ]);

    score.recordNRT(
        nil,
        outputPath.standardizePath,
        sampleRate: sampleRate,
        headerFormat: headerFormat,
        sampleFormat: sampleFormat,
        options: ServerOptions.new.numOutputBusChannels_(decoder.numChannels),
        action: {
            "Converted FuMA -> ACN-SN3D: %".format(outputPath).postln;
            0.exit;
        }
    );
)
