# Font subsets

Latin subsets of Fraunces (opsz+wght variable) and Inter Tight 400/600, cut with fonttools to the characters the site uses:

    pyftsubset <font>.woff2 --unicodes="U+0020-007E,U+00A0,U+00A9,U+00AB,U+00B7,U+00BB,U+00C9,U+00E9,U+00E8,U+00EA,U+00E0,U+00E7,U+00F4,U+00FC,U+00F6,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2032,U+2033,U+2190-2194,U+2197,U+20AC,U+2122,U+00D7,U+2715,U+00B0" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk" --flavor=woff2

Source files: @fontsource-variable/fraunces, @fontsource/inter-tight (SIL Open Font License). Re-run if copy adds new non-ASCII characters.
