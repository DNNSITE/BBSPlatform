/*
* Project: bbsDropUpload
* Version: 1.1
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
            , existsFileData: []
            , existsFileFolderUrl: ''
            , gateUrl: ''
            , thmbnlWidth: 160
            , thmbnlHeight: 105
            , maxFilesize: 6
            , maxFiles: 10
            , acceptedFiles: 'image/*'
		, onChange: function () { }
        , onMaxFilesExceeded: function () { }
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                paneId = $(this).attr('id');
                initWidget();
            });
        }
        , getFileData: function () { return getFileData(); }
        , removeAllFiles: function () { removeAllFiles(); }
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

    var paneId, dropzoneObj, totExtFls = 0, initWidget = function () {
        var html = '', pObj = $('#' + paneId);
        html += '<div id="dropzonePane' + settings.modid + '" class="dropzone" data-files=\'[]\'></div>';
        pObj.replaceWith(html);
        Dropzone.autoDiscover = false;
        dropzoneObj = new Dropzone('#dropzonePane' + settings.modid, {
            url: settings.gateUrl
            , thumbnailWidth: settings.thmbnlWidth
            , thumbnailHeight: settings.thmbnlHeight
            , maxFilesize: settings.maxFilesize
            , maxFiles: settings.maxFiles
            , addRemoveLinks: true
            , acceptedFiles: settings.acceptedFiles
            , dictRemoveFile: ' X '
            , dictCancelUpload: settings.localzRes.cancelUploadText
            , dictResponseError: settings.localzRes.responseErrorText
            , dictFallbackMessage: settings.localzRes.fallbackMessageText
            , dictDefaultMessage: settings.localzRes.defaultMessageText
            , previewTemplate: '<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-image\"><img data-dz-thumbnail /></div>\n<div class=\"dz-details\"><textarea class=\"dz-descedt\" draggable=\"false\" maxlength=\"512\" disabled=\"disabled\"></textarea></div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>'
            , init: function () {
                var fd = settings.existsFileData, fdz, $this = this, flnm = '', fldr = '', prevElId = '', newItmData;
                if (!fd || typeof fd != 'object') { return; } if (fd.length == 0) { return; }
                $.each(fd, function (i, itm) {
                    flnm = itm.filename + '-sm' + itm.ext;
                    fdz = { "name": flnm, "type": "image/jpeg", "status": "success", "size": 0, "accepted": true, "processing": true };
                    prevElId = 'prevEl_' + itm.filename;
                    newItmData = { "filename": itm.filename, "ext": itm.ext, "desc": itm.desc, "emode": "update" };
                    $this.emit("addedfile", fdz);
                    $this.emit("thumbnail", fdz, settings.existsFileFolderUrl + '/' + flnm);
                    $this.emit("complete", fdz);
                    $this.files.push(fdz);
                    fdz.previewElement.setAttribute("id", prevElId);
                    $(fdz.previewElement).attr('id', prevElId).data('file', newItmData);
                    $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText).val(itm.desc);
                });
                totExtFls = fd.length;
            }
            , success: function (file, response) {
                var d = $.parseJSON(response);
                if (!d) { file.previewElement.classList.add("dz-error"); return false; }
                var prevElId = 'prevEl_' + d.filename;
                file.previewElement.classList.add("dz-success");
                file.previewElement.setAttribute("id", prevElId);
                $(file.previewElement).attr('id', prevElId).data('file', d);
                $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText);
            }
            , error: function (file, response) {
                file.previewElement.classList.add("dz-error");
                $(file.previewElement).find('.dz-error-message span').html(settings.localzRes.statusErrorText);
            }
            , maxfilesexceeded: function (file) {
                this.removeFile(file);
                settings.onMaxFilesExceeded.call(this);
            }
        });
    },
    removeAllFiles = function () {
        dropzoneObj.removeAllFiles();
    },
    getFileData = function () {
        var resd=[], fd = [], efd = settings.existsFileData, isExt = 0;
        $('#dropzonePane' + settings.modid + ' .dz-preview').each(function () {
            var fd_itm = $(this).data('file'), desc = '';
            if (!fd_itm || typeof fd_itm != 'object') { return true; }
            desc = $(this).find('textarea.dz-descedt').val(); if (desc) { fd_itm.desc = desc; }
            fd.push(fd_itm);
        });
	resd=fd;
        $.each(efd, function (i1, itm1) {
            isExt = 0;
            $.each(fd, function (i2, itm2) { if (itm1.filename == itm2.filename) { isExt = 1; return false; } });
            if (isExt == 0) { resd.push({"filename":itm1.filename,"ext":itm1.ext,"desc":itm1.desc,"emode":"del"});}
        });
        return resd;
    };
})(jQuery);