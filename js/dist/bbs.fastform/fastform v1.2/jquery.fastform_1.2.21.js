/*
 * Project: FastForm
 * Version: 1.2.21
 * Author: DNN.SITE
 * Website: http://dnn.site
*/

/*
* 
listData:
{
    name:""
   ,type:""
   ,ctype:""
   ,listdata:{extdata:{srcurl:"",apikey:""},locdata:[]}
}
*/
(function($){
    var defaults={
            localzRes:{
                 atText:'at'
                ,statusNewText:'New'
                ,statusOkText:'Ok'
                ,statusErrorText:'Error'
                ,uplFilesTotalText:'Total'
                ,uplFilesFileText:'File'
                ,xeditor_mdfolderselect:{selectorPlaceholderText:'Select folder...',emptyText:'Without folder'}
                ,xeditor_locationselect:{selectorPlaceholderText:'Select location...',emptyText:'Without location'}
                ,fileupload:{warrningSubject:'Warrning!',statusOkText:'Complete',statusErrorText:'An error has occurred. The file is not uploaded.',statusLoadingText:'Loading...',acceptedTitle:'Only file: '}
            }
            ,formId:'form'
            ,modId:''
            ,formData:[]
            ,listData:[]
            ,currencyData:[]
            ,currencyId:'840'            
            ,readOnly:false
            ,hideTitle:false
            ,spinnerEnable:true
            ,localiz_ageman:null
            ,onChange:function(){}
            ,onChange_SrchbleFld:function(){}
            ,onChange_NotSrchbleFld:function(){}
    }
    ,methods={
        init:function(options){            
            return this.each(function(){
                var wdgId=$(this).attr('id'),settings=$.extend(true,{},defaults,options),fd=[],fd_tmp=[];
                $(this).data("settings",settings);                
                if(settings.spinnerEnable){if($('#'+wdgId+'_spin').length){$(this).before('<div id="'+wdgId+'_spin" class="text-center"><i class="fa fa-circle-o-notch fa-spin"></i></div>');}$(this).hide();}
                fd_tmp=settings.formData;                
                if(fd_tmp&&typeof fd_tmp=='object'){                    
                    //if(fd_tmp.length>0){                        
                        if(fd_tmp.hasOwnProperty('localdata')){fd=fd_tmp.localdata;}
                        else if(fd_tmp.hasOwnProperty('extdata')){loadExtFormData($this);}
                        else{fd={data:fd_tmp,htmltmpl:''};}
                    //}
                }                
                $(this).data("formData",fd);
                //if(!fd||typeof fd!='object'){return true;}if(fd.length==0){return true;}
                initWidget(this);
            });
        }
        ,getFormData:function(validIgrore){return getFormData(this,validIgrore);}
        ,getShortFormData:function(validIgrore,noEmpty){return getValueData(this,validIgrore,noEmpty);}
        ,getValueData:function(validIgrore,noEmpty){return getValueData(this,validIgrore,noEmpty);}        
        ,fillForm:function(d){this.each(function(){fillForm(this,convertToFormData(this,d));});}
        ,clearForm:function(){this.each(function(){clearForm(this);});}
    };

    var stopEvnt=false
    /*,uploadFileOpenEditor=function(nm){ows.Fetch(settings.modId, 0, 'Action=openuploadpopup&ctrmn=' + nm, 'fileUploadPane' + settings.modId, function (s) { if (s != '200') { return false; } $('#modalUploadFile' + settings.modId).modal({ show: true, backdrop: 'static' }); });}
    ,uploadFile_Fill=function(nm,d,ro){
        if (ro) { $('#uplFiles_Button' + settings.modId).attr('disabled', 'disabled'); }
        $.each(d, function (i, itm) { uploadFileAddItem(settings.modId, nm, itm, ro); return; });
    }
    ,uploadFileAddItem=function(nm,d,ro){
        if(!d||typeof d!='object'){return;}if(d.length==0){return;}
        var o = '#uplFiles_' + nm + settings.modId, html = '', flicn = 'fa-file-text-o';
        if (d.ctype == 'doc') { flicn = 'fa-file-word-o'; } if (d.ctype == 'pdf') { flicn = 'fa-file-pdf-o'; } if (d.ctype == 'img') { flicn = 'fa-file-image-o'; }
        html += '<tr data-file=\'' + JSON.stringify(d) + '\'><td><i class="fa ' + flicn + '"></i></td><td><a href="' + d.path + '/' + d.name + d.ext + '" target="_blank">' + $('<div/>').text(d.title).html() + '</a></td><td style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"' + (ro ? ' disabled="disabled"' : '') + ' onclick="uploadFileDelItem(\'' + nm + '\',\'' + d.name + '\')"><i class="fa fa-trash-o"></i></button></td></tr>';
        $(o).append(html); uploadFileSetData(settings.modId, nm);
    }
    ,uploadFileDelItem=function(nm,id){
        $('#uplFiles_' + nm + settings.modId + ' tbody tr').each(function () { if ($(this).data('file').name == id) { $(this).remove(); } }); uploadFileSetData(settings.modId, nm);
    }
    ,uploadFileSetData = function (nm) {
        var ds = [], resData = '', tol = 0;
        $('#uplFiles_' + nm + settings.modId + ' tbody tr').each(function () { var d = $(this).data('file'); if (d) { ds.push(d); } });
        resData = JSON.stringify(ds); if (resData == '[]') { resData = ''; } $('#frmVal_' + nm + settings.modId).val(resData);
        if (resData != '') { tol = ds.length; } $('#uplFiles_Total_' + nm + settings.modId).html(tol);
    }
    ,showErrorAlert = function () {
        var h = '<div id="errorAlertPane' + settings.modId + '" class="alert alert-danger fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">?</button><h4>��������</h4><p>��������� ������.</p></div>';
        hideAlert(settings.modId); $('#formPane' + settings.modId).before(h);
    }
    ,showSuccessAlert = function () {
        var h = '<div id="successAlertPane' + settings.modId + '" class="alert alert-success fade in" style="margin:0;"><h4>�������!</h4><p>���� ������ ���������. ��� �� ������������ ��������� ����������� ���� �������������. ��� ����� ��� ���� ���������� ����������� ������ � ����������� ������������.</p><br/><div class="btn-group"><a href="/" class="btn btn-default">��</a></div></div>';
        hideAlert(); $('#formPane' + settings.modId).before(h);
    }
    ,hideAlert = function () {
        $('#errorAlertPane' + settings.modId).remove(); $('#successAlertPane' + settings.modId).remove();
    }*/
    ,getSettings=function($this){return $($this).data("settings");}    
    ,getFormDataSettings=function($this){return $($this).data("formData");}
    ,extvalidtext_Valid=function($this,itm){
        var settings=getSettings($this),o='#frmVal_'+itm.name+settings.modId;
        if(itm.hasOwnProperty('validrule')){if($(o).valid()==false){return false;}}
        var f={"vmode":itm.vmode,"key":itm.name,"val":$(o).val()},vmgn='validWaitMsg_'+itm.name+settings.modId;
        $(o).resetForm();$(o).attr('readonly','readonly');
        if (!$('#' + vmgn).length || $('#' + vmgn).length == 0) { $('#ctrPane_' + itm.name + settings.modId).append('<em id="' + vmgn + '" style="display: block;"><i class="fa fa-exclamation-triangle"></i> No Price...</em>'); }
        $.ajax({
            url: itm.validatorurl + '&jsoncallback=?',
            dataType: 'json',
            async: false,
            data: f,
            success: function (data) {
                $('#' + vmgn).remove(); $(o).removeAttr('readonly');
                $.map(data, function (item) {
                    if (item.isvalid == false) {
                        $(o).parent().addClass('state-error').removeClass('state-success');
                        $('em[for="frmVal_' + itm.name + settings.modId + '"]').remove();
                        $(o).parent().parent().append('<em for="frmVal_' + itm.name + settings.modId + '" class="invalid" style="display: block;">' + itm.errvalidmsg + '</em>');
                    }
                });
            }
        });
    }
    ,clearAdvList=function($this,panename){
        var settings=getSettings($this),o='#frmVal_'+panename+settings.modId;parentname=$(o).data('parentname');if(!parentname){parentname='';}
        if(parentname!=''){$(o).html('<option value=""></option>');}
        $(o).val('').trigger('chosen:updated');$(o).valid();
    }
    ,getUrlAdvList=function($this,panename){
        var settings=getSettings($this),parentname=$('#frmVal_'+panename+settings.modId).data('parentname');if(!parentname){parentname='';}
        return '/desktopmodules/ows/im.aspx?_OWS_=m:dnn_owsAppSrc,id:14032023-5508-0597-AC76-50E6C8A72BA3&apikey=' + panename + (parentname != '' ? '&pfltr=' + $('#frmVal_' + parentname + settings.modId).val() : '');
    }
    /*,extList_Load=function($this,panename,apikey,pid){
        var settings=getSettings($this),o='#frmVal_'+panename+settings.modId;$(o).html(''),f={"apikey":apikey,"pid":pid};
        $.ajax({
            url:settings.extListSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data: f,
            success: function (data) {
                $(o).append('<option value=""></option>'); $.map(data, function (item) { $(o).append('<option value="' + item.id + '">' + item.title + '</option>'); });
                extList_Fill($this,panename);
            }
        });
    }*/
    ,extList_Fill=function($this,panename){
        var settings=getSettings($this),d=$('#formPane'+settings.modId).data('form');
        if (!d||typeof d!='object'){return;}if(d.length==0){return;}
        $.each(d,function(i,itm){
            if (itm.ctype=='extlist'&&itm.name==panename) {
                var v=itm.value;if(v){
                    $('#frmVal_'+panename+settings.modId).val(v);$('#frmVal_' + panename + settings.modId).change(); $('#frmVal_' + panename + settings.modId).valid();
                } return;
            }
        });
    }
    ,initWidget=function($this,ro){
        var settings=getSettings($this),fd=getFormDataSettings($this),html=$($this).html(),wdgId=$($this).attr('id');     
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}        
        if(fd.hasOwnProperty('htmltmpl')){if(fd.htmltmpl!=''){$($this).html(fd.htmltmpl.replace(/\{0\}/g,settings.modId));}}
        $.validator.addMethod("regex",function(value,element,regexpr){return regexpr.test(value);},"Please enter a valid value.");
        $(settings.formId).validate({
            ignore:""
            ,errorElement:'em',errorClass:'invalid',errorPlacement:function(error,element){
                var o,isIgnor=false;if($(element).attr('id')=='undefined'){isIgnor=true;}
                if($(element).hasClass('selectpicker')){o=$(element).parent();}else{o=$(element);}
                if($(element).hasClass('ignore')){isIgnor=true;}
                var disattr = $(element).attr('disabled'),roattr=$(element).attr('readonly'); if (typeof disattr !== typeof undefined && disattr !== false) { isIgnor = true; } if (typeof roattr != typeof undefined && roattr !== false) { isIgnor = true; } if (isIgnor) { return; }
                error.insertAfter(o);
            }
            ,highlight: function (element, errorClass, validClass) {
                var o, isIgnor = false;
                if ($(element).hasClass('selectpicker')) { o = $(element).parent(); } else { o = $(element).parent(); }
                if ($(element).attr('id') == 'undefined') { isIgnor = true; } if ($(element).hasClass('ignore')) { isIgnor = true; }
                var disattr = $(element).attr('disabled'), roattr = $(element).attr('readonly'); if (typeof disattr !== typeof undefined && disattr !== false) { isIgnor = true; } if (typeof roattr != typeof undefined && roattr !== false) { isIgnor = true; }

                if (isIgnor) { o.removeClass('state-error').removeClass('state-success'); return; }
                o.addClass('state-error').removeClass('state-success'); var o2 = $('#' + $(element).attr('id') + '_chosen a'); o2.removeClass('state-success').addClass('state-error')
            }
            ,unhighlight:function(element,errorClass,validClass){
                var o;
                if ($(element).hasClass('selectpicker')) { o = $(element).parent(); } else { o = $(element).parent(); }
                if ($(element).attr('id') == 'undefined') { return; } if ($(element).hasClass('ignore')) { return; }
                o.removeClass('state-error').addClass('state-success');
                var o2 = $('#' + $(element).attr('id') + '_chosen a'); o2.removeClass('state-error'); if ($(element).val() != '') { o2.addClass('state-success'); }
            }
        });        

        $.each(fd.data,function(i,itm){
            var pObj=$('#fldPane_'+itm.name+settings.modId),cntrObj='#frmVal_'+itm.name+settings.modId,defVsl=true,defEnbl=true,cntrEnbl=true,cntrReq=false,html='';
            if(pObj.length){
                var itmAlt=$(pObj).data('prop');                
                if(itmAlt&&typeof itmAlt=='object'){
                    itmAlt['name']=itm.name;
                    itm=mixerFormData(itmAlt,itm);                    
                }
                if(itm.hasOwnProperty('visible')){defVsl=itm.visible;}
                if(itm.hasOwnProperty('enable')){defEnbl=itm.enable,cntrEnbl=defEnbl;}
                if(itm.hasOwnProperty('validrule')){cntrReq=itm.validrule.required;}                

                if (itm.ctype=='text'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' class="form-control" />';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    if (itm.hasOwnProperty('mask')) { if (itm.mask) { $(cntrObj).mask(itm.mask/*, { placeholder: ' ' }*/); } }
                    $(cntrObj).on('change',function(){if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); } if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}}});
                }
                if (itm.ctype=='extvalidtext'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<div class="input-group">';
                    if (itm.hasOwnProperty('leftsubtitle')) { if (itm.leftsubtitle != '') { html += '<div class="input-group-addon">' + itm.leftsubtitle + '</div>'; } }
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                    if (itm.hasOwnProperty('rightsubtitle')) { if (itm.rightsubtitle != '') { html += '<div class="input-group-addon">' + itm.rightsubtitle + '</div>'; } }
                    html += '</div>';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).on('change',function(){extvalidtext_Valid($this,itm);if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); } if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } } });
                    $(cntrObj).rules("add", { regex: "^[a-zA-Z'.\\s]{1,40}$" })
                }
                if (itm.ctype=='multitext'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label ' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="textarea' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<textarea rows="' + itm.rows + '" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' disabled="disabled"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + '>' + (itm.defval ? itm.defval : '') + '</textarea>';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).on('change', function () {
                        if (itm.hasOwnProperty('triggers')) { triggerFldProc($this,itm.triggers, $(this).val()); } settings.onChange.call(this);
                        if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); }
                    });
                }
                if (itm.ctype=='rangeslider'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" class="rangesliderpane" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<input type="hidden" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (itm.defval ? ' value="' + itm.defval + '"' : '') + ' />';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).ionRangeSlider({
                        "type": "double"
                        , "min": itm.options.min
                        , "max": itm.options.max
                        , "grid": itm.options.grid
                        , onFinish: function () {
                            if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                            if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                        }
                    });

                    /*$(cntrObj).on('change', function () {
                        if (itm.hasOwnProperty('triggers')) { triggerFldProc($this,itm.triggers, $(this).val()); }
                        if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });*/
                }
                if (itm.ctype=='rangedigit'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    var plcholder = '', plcholder_min = 'From', plcholder_max = 'To', strArrVal = '', defval_min = '', defval_max = '';
                    if (itm.hasOwnProperty('plcholder')) { plcholder = itm.plcholder; }
                    if (itm.hasOwnProperty('plcholder_min')) { plcholder_min = itm.plcholder_min; } else { plcholder_min = (plcholder == '' ? plcholder_min : plcholder + ': ' + plcholder_min); }
                    if (itm.hasOwnProperty('plcholder_max')) { plcholder_max = itm.plcholder_max; } else { plcholder_max = (plcholder == '' ? plcholder_max : plcholder + ': ' + plcholder_max); }
                    if (itm.defval != '') { strArrVal = '[' + itm.defval.replace(/|/g, ',') + ']'; if ($.isArray(eval(strArrVal))) { defval_min = eval(strArrVal)[0]; defval_max = eval(strArrVal)[1]; } else { strArrVal = ''; } }
                    if (!settings.hideTitle) { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<div class="form-inline">';
                    html += '<div class="form-group">';
                    html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    if (itm.hasOwnProperty('prepcssicn')) { if (itm.prepcssicn) { html += '<i class="icon-prepend ' + itm.prepcssicn + '"></i>'; } }
                    if (itm.hasOwnProperty('appcssicn')) { if (itm.appcssicn) { html += '<i class="icon-append ' + itm.appcssicn + '"></i>'; } }
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '_min" name="frmVal_' + itm.name + settings.modId + '_min"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (defval_min ? ' value="' + defval_min + '"' : '') + (plcholder_min ? ' placeholder="' + plcholder_min + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                    if (itm.hasOwnProperty('tooltip_min')) { if (itm.tooltip_min) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip_min + '</b>'; } }
                    html += '</label>';
                    html += '</div>';
                    html += '<div class="form-group">';
                    html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '_max" name="frmVal_' + itm.name + settings.modId + '_max"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (defval_max ? ' value="' + defval_max + '"' : '') + (plcholder_max ? ' placeholder="' + plcholder_max + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                    if (itm.hasOwnProperty('tooltip_max')) { if (itm.tooltip_max) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip_max + '</b>'; } }
                    html += '</label>';
                    html += '</div>';
                    html += '</div>';
                    html += '<input type="hidden" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (itm.defval ? ' value="' + itm.defval + '"' : '') + '>';
                    html += '</div>';
                    pObj.replaceWith(html);
                    if (itm.hasOwnProperty('mask')) { if (itm.mask) { $(cntrObj + '_min').mask(itm.mask/*,{ placeholder: ' ' }*/); $(cntrObj + '_max').mask(itm.mask/*, { placeholder: ' ' }*/); } }
                    if (strArrVal != '') { $(cntrObj).val(itm.defval); }
                    $((cntrObj + '_min,' + cntrObj + '_max')).on('change', function () {
                        var minval = $(cntrObj + '_min').val(), maxval = $(cntrObj + '_max').val(); minval = minval.replace(/ /g, ''); maxval = maxval.replace(/ /g, '');
                        if (isNaN(minval) == true) { $(cntrObj + '_min').val(''); minval = ''; } if (isNaN(maxval) == true) { $(cntrObj + '_max').val(''); maxval = ''; }
                        var dval = (minval == '' ? 'null' : minval) + '|' + (maxval == '' ? 'null' : maxval); if (dval == 'null:null') { dval = ''; } $(cntrObj).val(dval);
                        if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, dval); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); }
                    });
                }
                if (itm.ctype=='email'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<i class="icon-append fa fa-envelope"></i>';
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).on('change', function () {
                        if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); }
                        if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }
                if(itm.ctype=='phone'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<i class="icon-append fa fa-phone"></i>';
                    html += '<input type="text" id="frmVal_'+itm.name+settings.modId+'" name="frmVal_'+itm.name+settings.modId+'"'+(ro?' disabled="disabled"':'')+(itm.defval?' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    if (itm.mask) { $(cntrObj).mask(itm.mask,{placeholder:'X'});}
                    $(cntrObj).on('change',function(){
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if(!stopEvnt){settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }

                if(itm.ctype=='date'){
                    var dateformat = 'dd.mm.yy';
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="input' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<i class="icon-append fa fa-calendar"></i>';
                    html += '<input type="text" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + '/>';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    if (itm.hasOwnProperty('dateformat')) { if (itm.dateformat != '') { dateformat = itm.dateformat; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);                    
                    $(cntrObj).datepicker({dateFormat:dateformat,prevText: '<i class="fa fa-chevron-left"></i>', nextText: '<i class="fa fa-chevron-right"></i>' });
                    $(cntrObj).datepicker($.datepicker.regional['ru']);
                    $(cntrObj).on('change', function () {
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if(!stopEvnt){settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }
                if(itm.ctype=='money'){
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl == false ? ' style="display:none;"' : '') + '>';
                    var plcholder='',strArrVal='',defval_prc='',defval_cur=settings.currencyId,inptmask='# ##0';
                    if(itm.hasOwnProperty('plcholder')){plcholder=itm.plcholder;}
                    if(itm.hasOwnProperty('defval')){if(itm.defval!=''){strArrVal='['+itm.defval.replace(/|/g,',')+']';if($.isArray(eval(strArrVal))){defval_prc=eval(strArrVal)[0]; defval_cur = eval(strArrVal)[1]; } else { strArrVal = ''; } } }
                    //if (itm.hasOwnProperty('mask')) { if (itm.mask) { inptmask = itm.mask; } }
                    if(!settings.hideTitle){html+='<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html+='<label id="frmVal_'+itm.name+settings.modId+'_pane" class="moneyinput"></label>';
                    html+='<input type="hidden" id="frmVal_'+itm.name+settings.modId+'" name="frmVal_'+itm.name+settings.modId+'"'+(itm.defval?' value="'+itm.defval+'"':'')+'>';
                    html+='</div>';
                    pObj.replaceWith(html);
                    $('#frmVal_'+itm.name+settings.modId+'_pane').bbsMoneyInput({
                        localzRes:{placeholderText:''}                
                        ,modId:itm.name+settings.modId
                        ,dVal:itm.defval
                        ,defCurrId:settings.currencyId
                        ,currListData:settings.currencyData
                        ,isReq:cntrReq
                        ,onChange:function(v){
                            $(cntrObj).val(v);
                            if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,dval);}
                            settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}
                        }
                    });
                }
                if(itm.ctype=='list'||itm.ctype=='select'){
                    var d1;
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="select' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' disabled="disabled"' : '') + '>';
                    html += '<option value=""></option>';
                    if (itm.hasOwnProperty('listdata')) { d1 = itm.listdata; $.each(d1, function (i2, itm2) { html += '<option value="' + itm2.value + '"' + (itm.defval == itm2.value ? ' selected="selected"' : '') + (itm2.dis ? ' disabled="disabled"' : '') + '>' + itm2.title + '</option>'; }); }
                    html += '</select>';
                    html += '<i></i>';
                    if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).on('change',function(){
                        if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val()); }
                        if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }

                if(itm.ctype=='extlist'||itm.ctype=='advlist'||itm.ctype=='select2'){
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl==false?' style="display:none;"':'')+'>';
                    if(!settings.hideTitle){html+='<label class="label'+(cntrReq?' reqInd':'')+'" for="frmVal_'+itm.name+settings.modId+'">'+itm.title+'</label>';}
                    html+='<label class="select'+(cntrReq?' reqInd':'')+'" >';
                    //if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html+='<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (itm.plcholder ? ' data-placeholder="' + itm.plcholder + '"' : 'data-placeholder=" "') + '>';
                    html+='<option class="plcholder" value="" disabled="disabled">' + (itm.plcholder ? itm.plcholder : '') + '</option>';
                    html+='</select>';                    
                    html+='</label></div>';
                    pObj.replaceWith(html);
                    if(itm.listautoload){setControlListData($this,itm.name,null);}else{cntrEnbl=false;}
                    $(cntrObj).on('change',function(){
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if(!stopEvnt){settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}}
                    });
                }

                if(itm.ctype=='selectpicker'){
                    //var ld=itm.listDatalistdata.localdata,extLd=0;
                    //if(ld&&typeof ld=='object'){extLd=1;}if(ld.length>0){extLd=1;} 
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if(!settings.hideTitle){html+='<label class="label'+(cntrReq?' reqInd':'')+'" for="frmVal_'+itm.name+settings.modId+'">'+itm.title+'</label>';}
                    html += '<label class="selectpicker' + (cntrReq ? ' reqInd' : '') + '">';
                    //if (itm.hasOwnProperty('tooltip')) { if (itm.tooltip) { html += '<b class="tooltip tooltip-top-right">' + itm.tooltip + '</b>'; } }
                    html += '<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '" data-none-selected-text=""'+(itm.plcholder ? ' data-placeholder="' + itm.plcholder + '"' : 'data-placeholder=" "') + ' class="selectpicker form-control" data-size="7" data-haslist="0">';
                    html += '<option class="plcholder" value="">' + (itm.plcholder ? itm.plcholder : '') + '</option>';
                    //html += '<option class="plcholder" value=""'+(itm.hasOwnProperty('listdata')?'':' disabled="disabled"')+'>' + (itm.plcholder ? itm.plcholder : '') + '</option>';                    
                    //$.each(ld,function(i2,itm2){html+='<option value="'+itm2.value+'"'+(itm.defval==itm2.value?' selected="selected"':'')+(itm2.dis?' disabled="disabled"':'')+(itm2.hasOwnProperty('icncss')?' data-icon="'+itm2.icncss+'"':'')+'>'+itm2.title+'</option>';}); 
                    html += '</select>';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    if(itm.hasOwnProperty('listautoload')){if(itm.listautoload==false){cntrEnbl=false;}}                    
                    $(cntrObj).on('show.bs.select',function(e){setControlListData($this,itm.name,null);});
                    $(cntrObj).on('change',function(){                        
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if(!stopEvnt){$(this).valid();settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}}
                    });
                }

                if(itm.ctype=='mdselector'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="select' + (cntrReq ? ' reqInd' : '') + '">';                    
                    html += '<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"' + (itm.plcholder ? ' data-placeholder="' + itm.plcholder + '"' : 'data-placeholder=" "') + ' class="form-control">';
                    //html += '<option class="plcholder" value="">' + (itm.plcholder ? itm.plcholder : '') + '</option>';
                    //html += '<option class="plcholder" value=""'+(itm.hasOwnProperty('listdata')?'':' disabled="disabled"')+'>' + (itm.plcholder ? itm.plcholder : '') + '</option>';
                    /*if (itm.hasOwnProperty('listdata')) { var d1 = itm.listdata; $.each(d1, function (i2, itm2) { html += '<option value="' + itm2.value + '"' + (itm.defval == itm2.value ? ' selected="selected"' : '') + (itm2.dis ? ' disabled="disabled"' : '') + (itm2.hasOwnProperty('icncss') ? ' data-icon="' + itm2.icncss + '"' : '') + '>' + itm2.title + '</option>'; }); }*/
                    html += '</select>';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $('#frmVal_'+itm.name+settings.modId).select2({
                        theme:'bootstrap'
                        ,ajax:getMDSelectorData($this,itm.name)
                        //,hideSelectionFromResult:function(selectedObject){return false;}
                        ,escapeMarkup:function(text){return text;}
                        ,minimumResultsForSearch:settings.minCurrResultsForSearch
                        ,minimumInputLength:0
                        /*,templateResult:getSelTemp
                        ,templateSelection:getSelTemp*/
                        ,allowClear:false
                        //,dropdownParent:$('#modalFormEditor[ModuleID,System]')
                        ,templateResult:getSelect2TempResult
                        ,templateSelection:function(repo){return repo.name;}
                    });  

                    /*if (!itm.hasOwnProperty('listdata') && itm.hasOwnProperty('listsrcurl') && itm.hasOwnProperty('lstgrpguid')) {
                        if (itm.hasOwnProperty('listautoload')){if(itm.listautoload){setControlListData($this,itm.name,itm.lstgrpguid,null);}else{cntrEnbl=false;}}
                    }
                    $(cntrObj).on('change', function () {
                        if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if (!stopEvnt) { $(this).valid(); settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this); } }
                    });*/
                }                

                /*if(itm.ctype=='advlist'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="select' + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '" data-type="advlist"' + (itm.plcholder ? ' data-placeholder="' + itm.plcholder + '"' : 'data-placeholder=" "') + (itm.parentname != '' ? ' data-parentname="' + itm.parentname + '"' : '') + '>';
                    html += '<option value=""></option>';                    
                    html += '</select>';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).ajaxChosen({ dataType: 'json', type: 'POST', url: '' }, { loadingImg: '/images/loading16.gif', minLength: 2, generateUrl: function (q){return getUrlAdvList($this,itm.name); } }, { width: "100%", no_results_text: '�� ������� ��: ', allow_single_deselect: true });
                    $(cntrObj).on('change', function () {
                        $(this).valid(); if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); }
                        if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                    if(itm.parentname!=''){$('#frmVal_'+itm.parentname+settings.modId).on('change',function(){clearAdvList($this,itm.name);});}
                }*/

                if(itm.ctype=='chek'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    /*html += '<label class="label" for="frmVal_' + itm.name + settings.modId + '">&nbsp;</label>';*/
                    //if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="checkbox' + (cntrReq ? ' reqInd' : '') + '"><input type="checkbox" id="frmVal_' + itm.name + settings.modId + '" value="1" name="frmVal_' + itm.name + settings.modId + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' checked="checked"' : '') + '><i></i>' + itm.title + '</label></div>';
                    pObj.replaceWith(html);
                    $(cntrObj).on('change', function () {
                        if (itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); }
                        if (!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }
                if(itm.ctype=='radioboolbtns'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" class="btn-group' + (itm.hasOwnProperty('isrespons') ? (itm.isrespons ? ' btn-group-justified' : '') : ' btn-group-justified') + ' btn-group-radio" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + ' data-toggle="buttons">';
                    var nulltxt = itm.hasOwnProperty('nulltxt') ? itm.nulltxt : 'Nothing', ontxt = (itm.hasOwnProperty('ontxt') ? itm.ontxt : 'On'), offtxt = (itm.hasOwnProperty('offtxt') ? itm.offtxt : 'Off');
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    if (nulltxt != '') { html += '<label class="btn radio' + (itm.defval === '' ? ' active' : '') + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === '' ? ' checked="checked"' : '') + ' autocomplete="off">' + nulltxt + '</label>'; }
                    if (ontxt != '') { html += '<label class="btn radio' + (itm.defval === 1 || itm.defval === "1" || itm.defval === true ? ' active' : '') + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="1" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === 1 || itm.defval === "1" || itm.defval === true ? ' checked="checked"' : '') + ' autocomplete="off">' + ontxt + '</label>'; }
                    if (offtxt != '') { html += '<label class="btn radio' + (itm.defval === 0 || itm.defval === "0" || itm.defval === false ? ' active' : '') + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="0" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === 0 || itm.defval === "0" || itm.defval === false ? ' checked="checked"' : '') + ' autocomplete="off">' + offtxt + '</label>'; }
                    html += '</div>';
                    pObj.replaceWith(html);
                    $('input[name="frmVal_' + itm.name + settings.modId + '_radiobtn"]').on('change', function () {
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers, $(this).val()); }
                        if(!stopEvnt) { settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }

                if(itm.ctype=='radiobool'){
                    var nulltxt = itm.hasOwnProperty('nulltxt') ? itm.nulltxt : 'Nothing', ontxt = (itm.hasOwnProperty('ontxt') ? itm.ontxt : 'On'), offtxt = (itm.hasOwnProperty('offtxt') ? itm.offtxt : 'Off');
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) { html += '<label class="label' + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<div class="inline-group">';
                    html += '<label class="radio' + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === '' ? ' checked="checked"' : '') + '><i></i>' + nulltxt + '</label>';
                    html += '<label class="radio' + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="1" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === 1 || itm.defval === "1" || itm.defval === true ? ' checked="checked"' : '') + '><i></i>' + ontxt + '</label>';
                    html += '<label class="radio' + (cntrReq ? ' reqInd' : '') + '"><input type="radio" value="0" name="frmVal_' + itm.name + settings.modId + '_radiobtn"' + (ro ? ' disabled="disabled"' : '') + (itm.defval === 0 || itm.defval === "0" || itm.defval === false ? ' checked="checked"' : '') + '><i></i>' + offtxt + '</label>';
                    html += '</div>';
                    html += '</div>';
                    pObj.replaceWith(html);
                    $('input[name="frmVal_'+itm.name+settings.modId+'_radiobtn"]').on('change', function () {
                        if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                        if(!stopEvnt){settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } }
                    });
                }
                if(itm.ctype=='attachfiles'){
                    html = '<div id="ctrPane_' + itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (settings.hideTitle && itm.title != '') { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + '">' + itm.title + '</label>'; }
                    if (itm.hasOwnProperty('infotext')) { if (itm.infotext != '') { html += '<div class="alert alert-info fade in" style="margin:5px 0;">' + itm.infotext + '</div>'; } }
                    html += '<table id="uplFiles_' + itm.name + settings.modId + '" class="table table-bordered table-striped" style="width:100%;">';
                    html += '<thead style="background:#ECECEC;">';
                    html += '<tr><th style="width:30px;"></th><th>' + settings.localzRes.uplFilesFileText + '</th><th style="width:50px;"></th></tr>';
                    html += '</thead>';
                    html += '<tbody></tbody>';
                    html += '<tfoot style="background:#ECECEC;font-weight:bold;">';
                    html += '<tr>';
                    html += '<td colspan="3">' + settings.localzRes.uplFilesTotalText + ' <span id="uplFiles_Total_' + itm.name + settings.modId + '" class="badge rounded-2x badge-light" style="font-size:13px;">0</span></td>';
                    html += '</tr>';
                    html += '</tfoot>';
                    html += '</table>';
                    html += '<div class="input-group">';
                    html += '<button id="uplFiles_Button_' + itm.name + settings.modId + '" type="button" class="btn-u" onclick="uploadFileOpenEditor(\'' + itm.name + '\')">&nbsp<i class="fa fa-plus"></i>&nbsp</button>';
                    html += '</div>';
                    html += '<input type="hidden" id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"> ';
                    pObj.replaceWith(html);
                }
                if(itm.ctype=='xeditor_mdfolderselect'){                    
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl==false?' style="display:none;"':'')+'>';
                    if(!settings.hideTitle){html+='<label class="label'+(cntrReq?' reqInd':'')+'" for="frmVal_'+itm.name+settings.modId+'">'+itm.title+'</label>';}
                    html+='<div id="frmVal_'+itm.name+settings.modId+'_pane"></div>';
                    html+='<label class="xeditable'+(cntrReq?' reqInd':'')+'">';
                    html+='<input type="hidden" id="frmVal_'+itm.name+settings.modId+'" name="frmVal_'+itm.name+settings.modId+'">';   
                    html+= '</label>';                    
                    html+= '</div>';
                    pObj.replaceWith(html);
                    /*var listData,apikey='',srcurl='';                    
                    if(itm.hasOwnProperty('listdata')){listData=itm.listdata;}                    
                    if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}                    
                    if(srcurl==null||srcurl==''){listData=getListDataSettings($this,itm.name,itm.type,itm.ctype);if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}}*/                    
                    $('#frmVal_'+itm.name+settings.modId+'_pane').xEditMDFolderSelect({   
                        localzRes:settings.localzRes.xeditor_mdfolderselect
                        ,listData:getListDataSettings(settings.listData,itm.name,itm.type,itm.ctype)
                        ,modId:'[ModuleID,System]'
                        //,dVal:''
                        ,onChange:function(v){                            
                            var id='';
                            if(v!=null&&typeof v=='object'){id=v.id;}                            
                            $('#frmVal_'+itm.name+settings.modId).val(id).valid();
                            if(!stopEvnt){settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}}
                        }
                    });
                }
                if(itm.ctype=='xeditor_locationselect'){                    
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl==false?' style="display:none;"':'')+'>';
                    if(!settings.hideTitle){html+='<label class="label'+(cntrReq?' reqInd':'')+'" for="frmVal_'+itm.name+settings.modId+'">'+itm.title+'</label>';}
                    html+='<div id="frmVal_'+itm.name+settings.modId+'_pane" class="xeditlocationselect"></div>';
                    html+='<label class="xeditable'+(cntrReq?' reqInd':'')+'">';
                    html+='<input type="hidden" id="frmVal_'+itm.name+settings.modId+'" name="frmVal_'+itm.name+settings.modId+'">';
                    html+= '</label>';
                    html+= '</div>';
                    pObj.replaceWith(html);
                    $('#frmVal_'+itm.name+settings.modId+'_pane').xEditLocationSelect({
                        localzRes:settings.localzRes.xeditor_locationselect
                        ,listData:getListDataSettings(settings.listData,itm.name,itm.type,itm.ctype)
                        ,level:itm.level
                        ,modId:'[ModuleID,System]'
                        //,dVal:''
                        ,onChange:function(v){                            
                            var sv='';
                            if(v!=null&&typeof v=='object'){sv=JSON.stringify(v);}
                            $('#frmVal_'+itm.name+settings.modId).val(sv).valid();
                            if(itm.hasOwnProperty('triggers')){triggerFldProc($this,itm.triggers,$(this).val());}
                            if(!stopEvnt){settings.onChange.call(this);                                
                                if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}
                            }/*else{console.log('NOEVENT: ',v);}*/
                        }
                    });
                }
                if(itm.ctype=='ageman'){
                    html='<div id="ctrPane_'+itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if (!settings.hideTitle) {html+='<label class="label' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '" for="frmVal_' + itm.name + settings.modId + '">' + itm.title + '</label>'; }
                    html += '<label class="ageman ' + (defEnbl == false ? ' state-disabled' : '') + (cntrReq ? ' reqInd' : '') + '">';
                    html += '<div id="frmVal_' + itm.name + settings.modId + '"></div>';
                    html += '</label></div>';
                    pObj.replaceWith(html);
                    $.fn.editableform.buttons = '<button type="button" class="btn btn-success editable-submit btn-mini"><i class="fa fa-check"></i></button>' + '<button type="button" class="btn editable-cancel btn-mini"><i class="fa fa-times"></i></button>';
                    $('#frmVal_'+itm.name+settings.modId).agemaneditor({
                        localzRes:settings.localiz_ageman
                        ,onChange:function(){if(!stopEvnt){settings.onChange.call(this);if(itm.srchble){settings.onChange_SrchbleFld.call(this);}else{settings.onChange_NotSrchbleFld.call(this);}}}
                    });
                }
                if(itm.ctype=='accountselector'){
                    html='<div id="ctrPane_'+itm.name + settings.modId + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                    if(!settings.hideTitle){html+='<label class="label'+(cntrReq?' reqInd':'')+'" for="frmVal_'+itm.name+settings.modId+'">'+itm.title+'</label>';}
                    html += '<label class="accountselector select' + (cntrReq ? ' reqInd' : '') + '">';
                    html+='<select id="frmVal_' + itm.name + settings.modId + '" name="frmVal_' + itm.name + settings.modId + '"></select>';
                    html+='</label></div>';
                    pObj.replaceWith(html);
                    $('#frmVal_'+itm.name+settings.modId).bbsAccAgreeSelector({
                        localzRes:{fldSelectorPlaceholderText:'Select account'}
                        ,listSrcUrl:'/desktopmodules/ows/im.aspx?_OWS_=m:dnn_owsAppSrc,id:15084278-4460-2F61-4723-3E85A369F8BB'
                        ,listSrcApiKey:'D854896F-B5C2-4A9C-93E4-4E149D72AE8F'
                        //,filterByTypes:'[bbs_Setup_DealerTypes,ModuleSettings]'                        
                        ,modId:itm.name+settings.modId                       
                        ,allowClear:false                        
                    });
                }                
                if(itm.ctype=='mdeditor'){
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-totalitems="0" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl==false?' style="display:none;"':'')+'>';
                    //html+='MD-Editor:: '+itm.name;
                    html+='</div>';
                    pObj.replaceWith(html);                    
                    $('#ctrPane_'+itm.name+settings.modId).bbsMDEditor({
                        localzRes:{
                             mdLocalzRes:settings.localzRes
                            ,btnAddMDItemTitle:(itm.hasOwnProperty('btnadditemtitle')?itm.btnadditemtitle:'')   
                        }
                        ,modId:itm.name+settings.modId+'_mdItemsPane'
                        ,title:itm.title
                        ,description:''
                        ,currencyData:settings.currencyData
                        ,currencyId:settings.currencyId
                        ,formData:itm.formdata
                        ,listData:settings.listData
                        ,dVal:null
                        /*,disabled:false
                        ,onChange:function(){}*/
                    });
                }
                if(itm.ctype=='fileupload'){
                    html='<div id="ctrPane_'+itm.name+settings.modId+'" data-totalitems="0" data-visible="'+defVsl+'" data-enable="'+defEnbl+'"'+(defVsl==false?' style="display:none;"':'')+'></div>';                    
                    pObj.replaceWith(html);
                    $('#ctrPane_'+itm.name+settings.modId).bbsFileUpload({                        
                         localzRes:settings.localzRes.fileupload                         
                        ,title:itm.title
                        ,fileData:[]
                        ,fileGateUrl:'/docupload.ashx'        
                        ,acceptedFiles:itm.acceptedfiles
                        ,acceptedFilesTitle:itm.acceptedfilestitle
                        //,onChange:function(v){console.log(v);}
                    });
                }
                setControlEnable($this,itm.name,cntrEnbl);
                setControlValidrule($this,itm);
                //if(itm.validrule.length!=0){$(cntrObj).rules('remove');$(cntrObj).rules('add',itm.validrule); }
            }
        });
        fillForm($this,fd.data);
        if(settings.spinnerEnable){$('#'+wdgId+'_spin').hide();$($this).show();}
    }
    ,mixerFormData=function(sdItm,fdItm){
        var res=fdItm;
        if(!sdItm||typeof sdItm!='object'){return res;}
        if(res.name!= sdItm.name){return res;}
        if(sdItm.hasOwnProperty('type')){if(isCompatFormData(sdItm.ctype, res.ctype)==false){return res;}}
        $.each(sdItm,function(key,val){res[key]=val;});
        return res;
    }
    ,isCompatFormData=function(sdTp,fdTp){
        var res=false;
        if(fdTp=='text'||fdTp=='phone'||fdTp=='email'||fdTp=='extvalidtext'||fdTp=='multitext'||fdTp=='rangedigit'||fdTp=='rangeslider'||fdTp=='money'){
            if(sdTp=='text'||sdTp=='phone'||sdTp=='email'||sdTp=='extvalidtext'||sdTp=='multitext'||sdTp=='rangedigit'||sdTp=='rangeslider'||sdTp=='selectpicker'||sdTp=='ageman'){res=true;}
        }
        if(fdTp=='list'||fdTp=='select'||fdTp=='extlist'||fdTp=='selectpicker'){
            if(sdTp=='list'||sdTp=='select'||sdTp=='extlist'||sdTp=='selectpicker'){res=true;}
        }
        if(fdTp=='chek'||fdTp=='switch'||fdTp=='radioboolbtns'||fdTp=='radiobool'){
            if(sdTp=='chek'||sdTp=='switch'||sdTp=='radioboolbtns'||sdTp=='radiobool'){res=true;}
        }
        if(fdTp=='attachfiles'){
            if(sdTp=='attachfiles'){res=true;}
        }
        return res;
    }
    ,setControlVal=function($this,nm,val){
        var settings=getSettings($this),fd=getFormDataSettings($this);
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        $.each(fd.data,function(i,itm){
            var o='#frmVal_'+itm.name+settings.modId;
            if(itm.name==nm){
                if(itm.ctype=='text'||itm.ctype=='list'||itm.ctype=='extlist'){
                    $(o).val(val);/* $(o).change();*/ /*$(o).valid(); $(settings.formId).valid();*/
                }
                return false;
            }
        });
    }
    ,setControlListData=function($this,nm,pval){
        var settings=getSettings($this),fd=getFormDataSettings($this),$itm;
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        $.each(fd.data,function(i,itm){if(itm.name==nm&&(itm.ctype=='extlist'||itm.ctype=='advlist'||itm.ctype=='select2'||itm.ctype=='selectpicker')){$itm=itm;return false;}});
        if($itm==null){return;}
        var o='#frmVal_'+$itm.name+settings.modId;                
        if($(o).data('haslist')==1){return false;}
        $(o).html('<option class="plcholder" value="">'+($(o).attr('data-placeholder')?$(o).data('placeholder'):'')+'</option>');$(o).val('');                 
        var srcurl='',apikey='',f,autoload=true,listData;
        if($itm.hasOwnProperty('listdata')){listData=$itm.listdata;}
        if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}
        if(srcurl==null||srcurl==''){listData=getListDataSettings(settings.listData,$itm.name,$itm.type,$itm.ctype);if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}}
        if(!pval||pval==''){if($itm.hasOwnProperty('listautoload')){autoload=$itm.listautoload;}else{autoload=false;}}
        if(!autoload){setControlEnable($this,$itm.name,false);return false;}
        f={apikey:apikey,lstgrpguid:$itm.lstgrpguid,pid:pval};
        $.ajax({
            url:srcurl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
                var isexitdata=true;
                if(!data||typeof data!='object'){isexitdata=false;}
                if (data.length==0){isexitdata=false;}
                if(!isexitdata){setControlEnable($this,$itm.name,false);}else{
                    $(o).html('<option class="plcholder" value="">'+($(o).attr('data-placeholder') ? $(o).data('placeholder') : '')+'</option>');
                    $.map(data,function(item){$(o).append('<option value="'+item.id+'"'+(item.hasOwnProperty('icncss')?' data-icon="'+item.icncss+'"' : '')+'>'+ item.title+'</option>');});
                    if($itm.ctype=='selectpicker'){
                        if(data.length>=10){$(o).attr('data-live-search',"true");}else{$(o).removeAttr('data-live-search');}
                        $(o).data('haslist',1);
                        $(o).selectpicker('refresh');
                        $(o).selectpicker('render');                                    
                    }
                    //setControlEnable($this,$itm.name,true);
                }
                setControlVal($this,$itm.name,'');
            }
        });
    }
    ,loadExtFormData=function($this){
        var settings=getSettings($this),fd_tmp=getFormDataSettings($this),srcurl='',apikey='';
        if(!fd_tmp||typeof fd_tmp!='object'){return;}if(fd_tmp.length==0){return;}
        if(!fd_tmp.hasOwnProperty('extdata')){return;}
        srcurl=fd_tmp.extdata.srcurl;apikey=fd_tmp.extdata.apikey;
        f={apikey:apikey};
        $.ajax({
            url:srcurl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
                var fd=[];                
                if(data&&typeof data=='object'){fd=data;}
                $($this).data("formData",fd);
                initWidget(this);
            }
        });
    }
    ,getListDataSettings=function(d,name,type,ctype){
        if(!d||typeof d!='object'){return;}if(d.length==0){return;}
        var rd;
        /*if(name){*/
            $.each(d,function(i,itm){                
                if(((itm.name==name&&itm.type==type&&itm.ctype==ctype)||(itm.name==name&&itm.ctype==ctype)||(itm.name==name&&itm.type==type))||((itm.type==type&&itm.ctype==ctype)||(itm.ctype==ctype)||(itm.type==type))){rd=itm.listdata;return false;}
            });
        /*}else{
            $.each(d,function(i,itm){
                if((itm.type==type&&itm.ctype==ctype)||(itm.ctype==ctype)||(itm.type==type)){rd=itm.listdata;return false;}
            });
        }*/
        return rd;
    }
    ,getMDSelectorData=function($this,nm){
        var settings=getSettings($this),fd=getFormDataSettings($this);
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        var $itm,autoload=true,listData,srcurl='',apikey=''
        $.each(fd.data,function(i,itm){if(itm.name==nm&&itm.ctype=='mdselector'){$itm=itm;return false;}});
        if($itm==null){return;}        
        if($itm.hasOwnProperty('listautoload')){autoload=$itm.listautoload;}
        if($itm.hasOwnProperty('listdata')){listData=$itm.listdata;}
        if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}
        if(srcurl==null||srcurl==''){listData=getListDataSettings(settings.listData,$itm.name,$itm.type,$itm.ctype);if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;apikey=listData.extdata.apikey;}}
        if(!autoload){setControlEnable($this,$itm.name,false);return false;}
        return {
            url:srcurl
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            /*,async:false*/
            ,data:function(p){
                return {
                     skey:p.term
                    ,pg:p.page
                    ,apikey:apikey /*"8d3c9b30-9772-40d8-801f-90931b00c991"*/
                    ,shmguid:$itm.shmguid};
            }
            ,processResults:function(data,p){
                p.page=p.page || 1;
                return {
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
        };
    }
 ,getSelect2TempResult=function(repo){
      if (repo.loading) return repo.text;
      var markup='<div class="select2-result-repository clearfix">' +
        //'<div class="select2-result-repository__icn"><i class="'+(repo.icncss!=""?repo.icncss:"fa fa-angle-right")+'" aria-hidden="true"></i></div>' +
        '<div class="select2-result-repository__meta">' +
          '<div class="select2-result-repository__title">' + repo.name + '</div>';     
      markup +="</div></div>";
      return markup;
    }

    ,setControlEnable=function($this,nm,v){
        var settings=getSettings($this),fd=getFormDataSettings($this);
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        $.each(fd.data,function(i,itm){
            if(itm.name==nm){
                if(itm.ctype=='text'||itm.ctype=='list'||itm.ctype=='extlist'){
                    if(v){
                        $('#ctrPane_' + itm.name + settings.modId + ' label.label').removeClass('state-disabled');
                        $('#ctrPane_' + itm.name + settings.modId + ' label.input').removeClass('state-disabled');
                        $('#ctrPane_' + itm.name + settings.modId + ' label.select').removeClass('state-disabled');
                        $('#frmVal_' + itm.name + settings.modId).removeAttr('disabled');
                    }else{
                        $('#ctrPane_' + itm.name + settings.modId + ' label.label').addClass('state-disabled');
                        $('#ctrPane_' + itm.name + settings.modId + ' label.input').addClass('state-disabled');
                        $('#ctrPane_' + itm.name + settings.modId + ' label.select').addClass('state-disabled');
                        $('#frmVal_' + itm.name + settings.modId).attr('disabled', 'disabled');
                    }
                }
                if (itm.ctype=='money'){
                    if(v){
                        $('#frmVal_'+itm.name+settings.modId+'_curid').prop('disabled',false);
                        //$('#frmVal_'+itm.name+settings.modId+'_price').removeAttr('disabled');
                    } else {
                        $('#frmVal_'+itm.name+settings.modId+'_curid').prop('disabled', true);
                        //$('#frmVal_'+itm.name+settings.modId+'_price').attr('disabled', 'disabled');
                    }
                    //$('#frmVal_' + itm.name + settings.modId + '_curid').selectpicker('refresh');
                }
                if (itm.ctype == 'selectpicker') {
                    if (v) {
                        $('#frmVal_' + itm.name + settings.modId).prop('disabled',false);
                    } else {
                        $('#frmVal_' + itm.name + settings.modId).prop('disabled',true);
                    }
                    $('#frmVal_'+itm.name+settings.modId).selectpicker('refresh');
                    //$(o).selectpicker('#frmVal_'+itm.name+settings.modId);
                }
                //$('#frmVal_' + itm.name + settings.modId).val(''); $('#frmVal_' + itm.name + settings.modId).change(); $('#frmVal_' + itm.name + settings.modId).valid(); $(settings.formId).valid();
                return false;
            }
        });
    }
    ,setControlVisible=function($this,nm,v){
        var settings=getSettings($this),fd=getFormDataSettings($this);
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        $.each(fd.data,function(i,itm){
            if (itm.name==nm) {
                if (itm.hasOwnProperty('visible')) { if (itm.visible == false) { return false; } }
                var pfxvs = ''; if (v) { pfxvs = ''; } else { pfxvs = 'none'; } $('#ctrPane_' + itm.name + settings.modId).css('display', pfxvs); $('#frmVal_' + itm.name + settings.modId).val('');
                return false;
            }
        });

    }
    ,setControlValidrule=function($this,itm){
        if(itm.hasOwnProperty('validrule')==false){return;}
        var v=itm.validrule;
        if(itm==null||typeof itm!='object'){return;}
        var settings=getSettings($this),vExts=0,cntrObj='';
        if(v!=null&&typeof v=='object'&&v.length!=0){vExts=1;}
        if(itm.ctype=='text'||itm.ctype=='list'||itm.ctype=='extlist'||itm.ctype=='selectpicker'||itm.ctype=='xeditor_mdfolderselect'||itm.ctype=='xeditor_locationselect'){
            cntrObj='#frmVal_'+itm.name+settings.modId;
            $(cntrObj).rules('remove');
            if(vExts==1){$(cntrObj).rules('add',v);}
        }
        if(itm.ctype=='money'){
            cntrObj='#frmVal_money'+itm.name+settings.modId+'_curid';
            $(cntrObj).rules('remove');
            if(vExts==1){                
                //$('#frmVal_moneyInput_'+itm.name+settings.modId+'_temp .input.input-group').addClass('reqInd');
                $(cntrObj).rules('add',v);
            }
        }
        return false;
    }
    ,fillForm=function($this,fd){
        var settings=getSettings($this),isClr=false,cntrObj='',itmval;
        if(fd==null||typeof fd!='object'){isClr=true;}else if(fd.length==0){isClr=true;}
        if(isClr){fd_tmp=getFormDataSettings($this);if(!fd_tmp.data||typeof fd_tmp.data!='object'){return;}if(fd_tmp.data.length==0){return;}fd=fd_tmp.data;}
        stopEvnt=true;
        $.each(fd,function(i,itm){
            cntrObj='#frmVal_'+itm.name+settings.modId;
            if(isClr){itmval='';}else if(itm.hasOwnProperty('value')){itmval=itm.value;}else if(itm.hasOwnProperty('val')){itmval=itm.val;}else if(itm.hasOwnProperty('defval')){itmval=itm.defval;}else{itmval='';}

            if(itm.ctype=='text'||itm.ctype=='extvalidtext'||itm.ctype=='multitext'||itm.ctype=='email'||itm.ctype=='phone'||itm.ctype=='date'||itm.ctype=='list'||itm.ctype=='extlist'||itm.ctype=='selectpicker'){
                $(cntrObj).val(itmval);
                $(cntrObj).change();
                //if (itm.hasOwnProperty('triggers')) { if (itm.triggers.length > 0) { $(cntrObj).change(); } } 
            }

            if (itm.ctype == 'rangeslider') {
                var sldr = $(cntrObj).data("ionRangeSlider"), strArrVal = '', defval_min = '', defval_max = '';
                if (itmval != '') {
                    strArrVal = '[' + itmval.replace(/\|/g, ',') + ']'; if ($.isArray(eval(strArrVal))) {
                        defval_min = eval(strArrVal)[0]; defval_max = eval(strArrVal)[1];
                        sldr.update({ from: defval_min, to: defval_max });
                    } else { sldr.reset(); }
                } else { sldr.reset(); }
            }

            if (itm.ctype == 'rangedigit') {
                var strArrVal = '', defval_min = '', defval_max = '';
                if (itmval != '') { strArrVal = '[' + itmval.replace(/\|/g, ',') + ']'; if ($.isArray(eval(strArrVal))) { defval_min = eval(strArrVal)[0]; defval_max = eval(strArrVal)[1]; } else { itmval = ''; } }
                $(cntrObj + '_min').val(defval_min);
                $(cntrObj + '_max').val(defval_max);
                $(cntrObj).val(itmval);
                $(cntrObj).change();
                //if (itm.hasOwnProperty('triggers')) { if (itm.triggers.length > 0) { $(cntrObj).change(); } } 
            }
            if (itm.ctype=='money'){
                var strArrVal='',prcVal='',curVal=settings.currencyId;
                if(itmval==null||typeof itmval!='object'){return true;}if(itmval.length==0){return true;}                
                $(cntrObj+'_pane').bbsMoneyInput('setDataValue',itmval);
            }
            if (itm.ctype == 'advlist') {
                var d = itmval, isEmpty = true, isExt = false;
                if (d != null && typeof d == 'object') { if (d.length != 0) { isEmpty = false; } }
                if (isEmpty == false) {
                    itmval = (!isClr ? d[0].id : '');
                    $(cntrObj + ' option[value="' + itmval + '"]').each(function () { isExt = true; return; });
                    if (!isExt) { $(cntrObj).append('<option value="' + itmval + '">' + d[0].title + '</option>'); }
                    $(cntrObj).val(itmval);
                    $(cntrObj).trigger('chosen:updated');
                    $(cntrObj).change();
                }
            }
            if(itm.ctype == 'chek') {
                var ischk = false;
                if (itmval == "1") { ischk = true; }
                $(cntrObj).prop('checked', ischk);
                $(cntrObj).change();
            }
            if(itm.ctype == 'radioboolbtns' || itm.ctype == 'radiobool') {
                $('#ctrPane_' + itm.name + settings.modId + ' label input').each(function () {
                    $(this).parent().removeClass('active'); $(this).removeAttr('checked');
                    if (itmval != '') { if ($(this).val() == itmval) { $(this).parent().addClass('active'); $(this).attr('checked', 'checked'); } } else { if ($(this).val() == '') { $(this).parent().addClass('active'); $(this).attr('checked', 'checked'); } }
                });
                $('input:radio[name="frmVal_' + itm.name + settings.modId + '_radiobtn"]:checked').val(itmval);
            }
            if(itm.ctype=='xeditor_mdfolderselect'){                
                $(cntrObj+'_pane').xEditMDFolderSelect('setValue',itmval);
                $(cntrObj).val(itmval.id);
            }
            if(itm.ctype=='ageman'){
                var strArrVal='';
                if(itmval!=''){strArrVal=itmval.replace(/\|/g,',');}
                $('#frmVal_'+itm.name+settings.modId).agemaneditor('setValue',strArrVal);
            }

            //if ($(cntrObj).length) { $(cntrObj).valid(); }
        });
        stopEvnt = false;
    }
    ,clearForm=function($this){fillForm($this);}
    ,showForm=function($this){var settings=getSettings($this);$('#formPane'+settings.modId).removeAttr('style');}
    ,triggerFldProc=function($this,tr,vl){
        var settings=getSettings($this),hasTr=false,o;
        $.each(tr,function(i1,tritm){
            if(!tritm.onval&&tritm.onval==vl){
                if (tritm.hasOwnProperty('controls')) {
                    $.each(tritm.controls,function(i2,trcntritm) {
                        setControlEnable($this,trcntritm.name,trcntritm.enable);
                        setControlVisible($this,trcntritm.name,trcntritm.visible);
                        if(trcntritm.updatelistdata==true){
                            o='#frmVal_'+trcntritm.name+settings.modId;$(o).data('haslist',0);
                            setControlListData($this,trcntritm.name,vl);
                        }
                    });
                }
                hasTr=true;return false;
            }
        });
        if (hasTr==false){
            $.each(tr,function(i1,tritm){
                if(tritm.val==null){
                    if(tritm.hasOwnProperty('controls')){
                        $.each(tritm.controls,function(i2,trcntritm){
                            setControlEnable($this,trcntritm.name,trcntritm.enable);
                            setControlVisible($this,trcntritm.name,trcntritm.visible);
                            if(trcntritm.updatelistdata==true){
                                o='#frmVal_'+trcntritm.name+settings.modId;$(o).data('haslist',0);
                                setControlListData($this,trcntritm.name,vl);
                            }
                        });
                    }
                    return false;
                }
            });
        }
    }
    ,getFormData=function($this,validIgrore){
        var settings=getSettings($this);
        if(!validIgrore){if(!$(settings.formId).valid()){return null;}}
        var fd=getFormDataSettings($this),v=null;
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        $.each(fd.data,function(i,itm){
            v='',cntrObj='#frmVal_'+itm.name+settings.modId;
            if(itm.ctype=='text'||itm.ctype=='multitext'||itm.ctype=='email'||itm.ctype=='phone'||itm.ctype=='date'||itm.ctype=='list'||itm.ctype=='select'||itm.ctype=='extlist'||itm.ctype=='selectpicker'||itm.ctype=='accountselector'||itm.ctype=='mdselector'||itm.ctype=='xeditor_mdfolderselect'||itm.ctype=='xeditor_locationselect'){
                v=$(cntrObj).val();
            }
            if(itm.ctype=='rangeslider'){
                v=$(cntrObj).val().replace(/;/g,'|');
            }
            if(itm.ctype=='rangedigit'){
                v=$(cntrObj).val();
            }
            if(itm.ctype=='advlist'){
                v=$(cntrObj).val();
            }
            if(itm.ctype=='chek'){
                v=$(cntrObj).attr('checked')?"1":"0";
            }
            if(itm.ctype=='money'){
                if($(cntrObj+'_pane').length){v=$(cntrObj+'_pane').bbsMoneyInput('getValue');}
            }
            if(itm.ctype=='radioboolbtns'||itm.ctype=='radiobool'){
                v=$('input:radio[name="frmVal_' + itm.name + settings.modId+'_radiobtn"]:checked').val()
            }
            if(itm.ctype=='ageman'){
                v=$(cntrObj).agemaneditor('getValue');
                //if(v!=null){v=v.replace(/,/g, '|');}else{v='';}
            }
            if(itm.ctype=='attachfiles'){
                var atch= $(cntrObj).val();
                if(atch!=''){v=$.parseJSON($(cntrObj).val());}
            }
            if(itm.ctype=='mdeditor'){
                v=$('#ctrPane_'+itm.name+settings.modId).bbsMDEditor('getFormData',validIgrore);        
            }
            if(itm.ctype=='fileupload'){
                v=$('#ctrPane_'+itm.name+settings.modId).bbsFileUpload('getFileData');                
            }
            if(v==null){v='';}
            itm.value=v;
        });
        return fd.data;
    }
    ,getValueData=function($this,validIgrore,noEmpty){
        var settings=getSettings($this);
        if(!validIgrore){if(!$(settings.formId).valid()){return null;}}
        var fvd=getFormData($this,validIgrore);
        if(!fvd||typeof fvd!='object'){return null;}if(fvd.length==0){return null;}
        var fvd_res=[];
        $.each(fvd,function(i,itm){
            if(itm.ctype=='chek'){if(itm.value==''||itm.value==0||itm.value==null){return true;}}else{if(noEmpty==true&&(itm.value==''||itm.value==null)){return true;}}
            var d={"name":itm.name,"type":itm.type,"value":itm.value};fvd_res.push(d);
        });
        return fvd_res;
    }   

    /*,getShortFormData = function ($this,validIgrore,noEmpty){
        var settings=getSettings($this);
        if(!validIgrore){if(!$(settings.formId).valid()){return;}}
        var fvd=getFormData($this,validIgrore);
        if(!fvd||typeof fvd!='object'){return;}if(fvd.length==0){return;}
        var fvd_res=[];
        $.each(fvd,function(i,itm){
            if(itm.srchble) {
                if (itm.ctype == 'chek') { if (itm.value == '' || itm.value == 0 || itm.value == null) { return true; } } else { if (noEmpty == true && (itm.value == '' || itm.value == null)) { return true; } }
                var d = { "name": itm.name, "type": itm.ctype, "val": itm.value }; fvd_res.push(d);
            }
        });
        return fvd_res;
    }*/
    ,convertToFormData=function($this,d){
        if(d==null||typeof d!='object'){return;}if(d.length==0){return null;}        
        var settings=getSettings($this),fd=getFormDataSettings($this);
        if(!fd.data||typeof fd.data!='object'){return;}if(fd.data.length==0){return;}
        var dn=[],val;
        if(d[0]==null||typeof d[0]!='object'){
            $.each(d,function(k,v){
                $.each(fd.data,function(i,itm){if(k==itm.name){dn.push({"name":itm.name,"val":v,"type":itm.type,"ctype":itm.ctype}); return true;}});
            });            
        }else{
            $.each(d,function(i1,itm1){
                if(itm1.hasOwnProperty('value')){val=itm1.value;}else if(itm1.hasOwnProperty('val')){val=itm1.val;}else{return true;}
                $.each(fd.data,function(i2,itm2){if(itm1.name==itm2.name){dn.push({"name":itm2.name,"val":val,"type":itm2.type,"ctype":itm2.ctype});return false;}});
            });
        }
        return dn;
    }
    ,getMoneyCurSelectorTemp=function(s){        
        if (!s.id) {return s.text;}        
        var icn=$(s.element).data('icn'),v=$(s.element).attr('value'),t=$(s.element).html();         
        var m='<div class="select2-result-repository"><div class="select2-result-repository__cssicn"><i class="'+icn+'"></i></div><div class="select2-result-repository__meta"><div class="select2-result-repository__title">'+t+'</div></div></div>';
        return m;
    };
    $.fn.fastForm=function(methodOrOptions){
        if(methods[methodOrOptions]){return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));}
        else if(typeof methodOrOptions==='object'||!methodOrOptions){return methods.init.apply(this,arguments);}
        else{$.error('Method '+methodOrOptions+' does not exist on jQuery.fastForm');}
    }    
})(jQuery);