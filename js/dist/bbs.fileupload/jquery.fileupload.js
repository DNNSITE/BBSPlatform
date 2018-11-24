/*
 * Project: bbsFileUpload
 * Version: 1.0
 * Author: dnnsite.ru
 * Website: http://dnnsite.ru
*/
(function($){
    var defaults={
        localzRes:{
             cancelUploadText:null
            ,responseErrorText:null
            ,fallbackMessageText:null
            ,defaultMessageText:null
            ,statusOkText:null
            ,statusErrorText:null
            ,placeholderDescriptText:null
            }
            ,modid:''
            ,fileData:[]
            ,gateUrl:''
            ,thmbnlWidth:160
            ,thmbnlHeight:105
            ,maxFilesize:6
            ,acceptedFiles:'image/*'
            ,existsFilesFolderUrl:''
        /*,newFilesFolderUrl:''*/
		, onChange: function () { }
    }
    ,settings
    ,methods={
        init:function(options){
            settings=$.extend({},defaults,options);
            return this.each(function(){
                paneId=$(this).attr('id');
                initWidget();
            });
        }
        ,getFileData:function(isRaw){return getFileData(isRaw);}
        ,clearFile:function(){clearFile();}
    };

    $.fn.bbsFileUpload=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments,1));
        } else if (typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bbsFileUpload');
        }
    }

    var paneId, dropzoneObj
    ,initWidget=function(){
        var settings=getSettings($this),d=settings.fileData,wdgt=$($this),wdgtId=$($this).attr('id'),isDataExst=true,html='';
        if(!d||typeof d!='object'){isDataExst=false;}else if(d.length==0){isDataExst=false;}
        html+='<div>';
        html+='<label for="file" class="input input-file">';
        html+='<div class="button"><input id="'+wdgtId+'_UploadFile" name="'+wdgtId+'_UploadFile" type="file" accept=".jpg,.gif,.png">&nbsp;<i class="fa fa-plus"></i>&nbsp;</div><input id="'+wdgtId+'_Subject" type="text" placeholder="">';
        html+='</label>';
        html+='<div class="note"><strong>Only file:</strong> jpg, gif, png</div>';
        html+='<span id="'+wdgtId+'_progressPane" style="visibility: hidden;">';
        html+='<h3 class="heading-xs">Loading... <span id="'+wdgtId+'_progressTotal" class="pull-right"></span></h3>';
        html+='<div class="progress progress-u progress-xs"><div id="'+wdgtId+'_progressBar" class="progress-bar progress-bar-blue" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0"></div></div>';
        html+='</span>';
        html+='</div>';                 
        wdgtId.replaceWith(html);
        //onchange="uploadFile_EventImageItem[ModuleID,System]();"
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