/*
 * Project: bbsGallery
 * Version: 1.0
 * Author: dnnsite.ru
 * Website: http://dnnsite.ru
*/
(function ($) {
    var defaults = {
          modid: ''
        , galleryData: []
        , adsId: ''
        , galleryPath: ''
        , noPhotoFullPath: ''
        , autoScaleSliderWidth:960
        , autoScaleSliderHeight:720
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                paneId = $(this).attr('id');
                initGallegy();
            });
        }
    };

    $.fn.bbsGallery = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bbsGallery');
        }
    }
    var paneId, initGallegy = function () {
        var html = '', d = settings.galleryData, pObj = $('#' + paneId), galleryFullPath = settings.galleryPath + settings.adsId + '/img/', isDataExst=true;
        if (!d || typeof d != 'object') { isDataExst = false; } else if (d.length == 0) { isDataExst = false; }
        if (isDataExst) {
            $.each(d, function (i, itm) {
                html += ' <a class="rsImg"   data-rsBigImg="' + galleryFullPath + itm.filename + '-lg' + itm.ext + '" href="' + galleryFullPath + itm.filename + itm.ext + '.ashx?w='+settings.autoScaleSliderWidth+'&h='+settings.autoScaleSliderHeight+'&scale=both">' + (itm.desc==''?'':'<span>'+itm.desc+'</span>') + '<img width="96" height="72" class="rsTmb" src="' + galleryFullPath + itm.filename + '-sm' + itm.ext + '" /></a>';
            });

            pObj.addClass('royalSlider rsDefault rsDNNAds').html(html);
console.log('settings.autoScaleSliderWidth: ',settings.autoScaleSliderWidth);
            $(pObj).royalSlider({
                fullscreen: {
                    enabled: true,
                    nativeFS: true
                },
                controlNavigation: 'thumbnails',
                autoScaleSlider:true,
                autoScaleSliderWidth: 960, //settings.autoScaleSliderWidth,
                autoScaleSliderHeight:725, // settings.autoScaleSliderHeight,
                loop: true,
                imageScaleMode: 'fit-if-smaller',
                navigateByClick: true,
                numImagesToPreload: 2,
                arrowsNav: true,
                arrowsNavAutoHide: true,
                arrowsNavHideOnTouch: true,
                keyboardNavEnabled: true,
                fadeinLoadedSlide: true,
                globalCaption: true,
                globalCaptionInside: false,
                transitionType:'fade',
		transitionSpeed:300,
                thumbs: {
                    appendSpan: true,
                    firstMargin: true,
                    paddingBottom: 4
                }
            });
        } else { html = '<img src="' + settings.noPhotoFullPath + '" class="img-thumbnail img-responsive" />'; pObj.replaceWith(html); }
}
})(jQuery);