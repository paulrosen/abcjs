![abcjs](https://paulrosen.github.io/abcjs/img/abcjs_comp_extended_08.svg)

# Javascript library for rendering standard music notation in a browser.

This library makes it easy to incorporate **sheet music** into your **websites**. You can also turn visible **ABC** text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of one javascript file. You can also generate **MIDI files** or play them directly in your browser.

Full documentation is here: [abcjs documentation](https://paulrosen.github.io/abcjs/)

## Informal roadmap
I'm trying to get all the issues that will create breaking changes done before releasing 6.0.0. There will still be a few beta versions to come.

I am going to try to release new beta versions regularly with a few improvements in each.

The two changes that are coming soon that might affect your code are:
1) Break apart the paths in the SVG so that parts of the note can be targeted. (For instance, just the flag, or one note in a chord.)
2) Be able to set the minimum spacing for notes when there are lots of notes on a line.

There will also be a number of the open issues considered for each beta version.

If you have a particular issue that is impeding your usage of this library, please mention it in the issue.

Thanks, Paul

## Future breaking changes
For most users of abcjs there probably won't be any more breaking changes in this beta.

There will probably still be some changes to the structure of the SVG that is created but if you aren't doing post-processing you won't notice except for better layout of the music.

There might be a few changes to the data that is returned from the callbacks, both the click listener and timing callbacks. Hopefully that will just be added data and won't affect any code.

## Issues

Thanks so much for the bug reports and feature requests that are pouring into the issues. I appreciate you taking the time to help improve abcjs. This is not a full time project, though, so I can't promise a quick turn around on the issues. I am going to attempt to be caught up on responding once a week at least.

And I would love some help on this project, including documentation, bug fixes, testing, refactoring, modernizing tools, and adding features. If you are so inclined, please get in touch.

## Supported by BrowserStack
If you aren't using the same browser and machine that I use, you can thank [BrowserStack](https://browserstack.com/) for their support of this open-source project.

![BrowserStack](https://cdn.rawgit.com/paulrosen/abcjs/master/docs/.vuepress/public/img/browserstack-logo-600x315.png)
