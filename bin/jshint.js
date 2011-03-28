#!/usr/bin/env nodejs
// jshint wrapper for nodejs
// Adapted from rhino.js. Copyright 2002 Douglas Crockford
// Shebang removal regex uses insecure "."
// JSHINT is provided by fulljshint.js modified to export the global
/*global JSHINT */

(function (file) {
    var e, i, input, len, success, pad,
        path = __filename.split("/").slice(0, -2).join("/"),
        sys = require("sys"),
        fs = require("fs");

    if (!file) {
        sys.puts("Usage: jshint file.js");
        process.exit(1);
    }

    input = fs.readFileSync(file);
    if (!input) {
        sys.puts("jshint: Couldn't open file '" + file + "'.");
        process.exit(1);
    } else {
        input = input.toString("utf8");
    }

    JSHINT = require("../lib/fulljshint_export").JSHINT;

    // remove shebang (lifted from node.js)
    input = input.replace(/^\#\!.*/, "");

    success = JSHINT(input, {
        predef:   [ // CommonJS
                    "exports", 
                    // YUI
                    "YUI",
                    "YAHOO",
                    "YAHOO_config",
                    "YUI_config",
                    "Y",
                    // NodeJS
                    "GLOBAL",
                    "process",
                    "require",
                    "__filename",
                    "module"       ]
    });

    if (!success) {
        i = 0;
        len = JSHINT.errors.length;
        for (i=0; i<len; i++) {
            pad = '' + (i + 1);
            while (pad.length < 3) {
                pad = ' ' + pad;
            }
            e = JSHINT.errors[i];
            if (e) {
                sys.puts(pad + ' ' + e.line + ',' + e.character + ': ' + e.reason);
                sys.puts( '    ' + (e.evidence || '').replace(/^\s+|\s+$/, ""));
            }
        }
        process.exit(2);
    }

    sys.puts("OK");

}(process.ARGV[2]));
