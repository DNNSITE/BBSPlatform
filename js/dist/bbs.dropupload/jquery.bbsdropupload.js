/*
 * Project: bbsDropUpload
 * Version: 1.0
 * Author: dnnsite.ru
 * Website: http://dnnsite.ru
*/
(function ($) {
    var defaults = {
        localzRes: {
            cancelUploadText: null
            , responseErrorText: null
            , fallbackMessageText: null
            , defaultMessageText: null
            , statusOkText: null
            , statusErrorText: null
            , placeholderDescriptText: null
        }
            , modid: ''
            , fileData: []
            , gateUrl: ''
            , thmbnlWidth: 160
            , thmbnlHeight: 105
            , maxFilesize: 6
            , acceptedFiles: 'image/*'
            , existsFilesFolderUrl: ''
        /*,newFilesFolderUrl:''*/
		, onChange: function () { }
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                paneId = $(this).attr('id');
                initWidget();
            });
        }
        , getFileData: function (isRaw) { return getFileData(isRaw); }
        , clearFile: function () { clearFile(); }
    };

    $.fn.bbsDropUpload = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bbsDropUpload');
        }
    }

    var paneId, dropzoneObj, initWidget = function () {
        var html = '', d = settings.fileData, pObj = $('#' + paneId), isDataExst = true;
        if (!d || typeof d != 'object') { isDataExst = false; } else if (d.length == 0) { isDataExst = false; }

        html += '<div id="dropzonePane' + settings.modid + '" class="dropzone" data-files=\'[]\'></div>';
        pObj.replaceWith(html);

        Dropzone.autoDiscover = false;
        dropzoneObj = $('#dropzonePane' + settings.modid).dropzone({
            url: settings.gateUrl
            , thumbnailWidth: settings.thmbnlWidth
            , thumbnailHeight: settings.thmbnlHeight
            , maxFilesize: settings.maxFilesize
            , maxFiles: 13
            , addRemoveLinks: true
            , acceptedFiles: settings.acceptedFiles
            , dictRemoveFile: ' X '
            , dictCancelUpload: settings.localzRes.cancelUploadText
            , dictResponseError: settings.localzRes.responseErrorText
            , dictFallbackMessage: settings.localzRes.fallbackMessageText
            , dictDefaultMessage: settings.localzRes.defaultMessageText
            , previewTemplate: '<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-image\"><img data-dz-thumbnail /></div>\n<div class=\"dz-details\"><textarea class=\"dz-descedt\" draggable=\"false\" maxlength=\"512\" disabled=\"disabled\"></textarea></div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>'
            , success: function (file, response) {
                console.log('rrrrrrrrrrr', file.descr);
                var d = $.parseJSON(response);
                if (!d) { file.previewElement.classList.add("dz-error"); return false; }
                var prevElId = 'prevEl_' + d.filename;
                file.previewElement.classList.add("dz-success");
                file.previewElement.setAttribute("id", prevElId);
                $(file.previewElement).attr('id', prevElId).data('file', d);
                //console.log($('#' + prevElId).data('file'));
                $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText);
            }
            , error: function (file, response) {
                file.previewElement.classList.add("dz-error");
                $(file.previewElement).find('.dz-error-message span').html(settings.localzRes.statusErrorText);
            }
            , init: function () {
                var fd = settings.fileData, fdz, $this = this, flnm = '', fldr = '', prevElId = '';
                if (!fd || typeof fd != 'object') { return; } if (fd.length == 0) { return; }
                $.each(fd, function (i, itm) {
                    flnm = itm.filename + '-sm' + itm.ext;
                    fdz = { name: flnm, type: 'image/*' };
                    prevElId = 'prevEl_' + itm.filename;
                    //$this.addFile.call($this,fdz);
                    //$this.options.thumbnail.call($this, fdz, settings.existsFilesFolderUrl + '/' + flnm);
                    //$this.emit("complete", fdz);

                    //fdz.previewElement.classList.add('dz-success');
                    //fdz.previewElement.classList.add('dz-complete');
                    //"filename": "985d7ee2", "ext": ".jpg", "desc": ""


                    $this.emit("addedfile", fdz);
                    $this.emit("thumbnail", fdz, settings.existsFilesFolderUrl + '/' + flnm);
                    $this.emit("complete", fdz);
                    fdz.previewElement.setAttribute("id", prevElId);
                    $(fdz.previewElement).attr('id', prevElId).data('file', itm);
                    $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText).val(itm.desc);





                    console.log($('#' + prevElId).data('file'));
                });
                //$this.options.maxFiles = 3; 
                //$this.options.maxFiles - fd.length;
            }
            , maxfilesexceeded: function (file) {
                console.log('maxfilesexceeded', file);
                this.removeFile(file);
            }

            /*, maxfilesexceeded: function (file) {
                console.log('maxfilesexceeded', file);
                this.removeFile(file);
            }*/


        });

        //fillForm();
    },
    clearForm = function () {
        //fillForm(true);
    },
    getFileData = function () {
        var d = []; $('#dropzonePane' + settings.modid + ' .dz-preview').each(function () {
            var d_itm = $(this).data('file'), desc = '';
            if (!d_itm || typeof d_itm != 'object') { return; }
            desc = $(this).find('textarea.dz-descedt').val(); if (!desc || desc != '') { d_itm.desc = desc; }
            d.push($(this).data('file'));
        });
        $('#dropzonePane' + settings.modid).data('files', d);
        return d;
    },
    getShortFormData = function (isRaw, noEmpty) {
        if (!isRaw) { if (!$(settings.formid).valid()) { return null; } }
        var fvd = getFileData(isRaw);
        if (!fvd || typeof fvd != 'object') { return null; } if (fvd.length == 0) { return null; }
        var fvd_res = [];
        $.each(fvd, function (i, itm) {
            if (itm.srchble) { if (!noEmpty || !(itm.value == '' || itm.value == null)) { var d = { "name": itm.name, "type": itm.type, "val": itm.value }; fvd_res.push(d); } }
        });
        return fvd_res;
    };
})(jQuery);