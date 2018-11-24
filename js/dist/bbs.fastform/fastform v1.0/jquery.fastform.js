(function ($) {
    var defaults = {
        localzRes: {
            'atText': 'at'
            , 'statusNewText': 'New'
            , 'statusOkText': 'Ok'
            , 'statusErrorText': 'Error'
            , 'uplFilesTotalText': 'Total'
            , 'uplFilesFileText': 'File'
        }
                , formid: 'form'
                , modid: ''
                , dataForm: []
                , extListSrcUrl: ''
		, onChange: function () { }
        , onChange_SrchbleFld: function () { }
        , onChange_NotSrchbleFld: function () { }
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {                
                initForm(false);                
            });
        }
        ,getFormData: function (isRaw) { return getFormData(isRaw); }
        ,getSrchbleFormData: function (isRaw, isFull) { return getSrchbleFormData(isRaw, isFull); }
    };

    $.fn.fastForm = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.fastForm');
        }
    }

    var uploadFileOpenEditor = function (nm) {
        ows.Fetch(settings.modid, 0, 'Action=openuploadpopup&ctrmn=' + nm, 'fileUploadPane' + settings.modid, function (s) { if (s != '200') { return false; } $('#modalUploadFile' + settings.modid).modal({ show: true, backdrop: 'static' }); });
    },

uploadFile_Fill = function (nm, d, ro) {
    if (ro) { $('#uplFiles_Button' + settings.modid).attr('disabled', 'disabled'); }
    $.each(d, function (i, itm) { uploadFileAddItem(settings.modid, nm, itm, ro); return; });
},

uploadFileAddItem = function (nm, d, ro) {
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    var o = '#uplFiles_' + nm + settings.modid, html = '', flicn = 'fa-file-text-o';
    if (d.type == 'doc') { flicn = 'fa-file-word-o'; } if (d.type == 'pdf') { flicn = 'fa-file-pdf-o'; } if (d.type == 'img') { flicn = 'fa-file-image-o'; }
    html += '<tr data-file=\'' + JSON.stringify(d) + '\'><td><i class="fa ' + flicn + '"></i></td><td><a href="' + d.path + '/' + d.name + d.ext + '" target="_blank">' + $('<div/>').text(d.title).html() + '</a></td><td style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"' + (ro ? ' disabled="disabled"' : '') + ' onclick="uploadFileDelItem(\'' + nm + '\',\'' + d.name + '\')"><i class="fa fa-trash-o"></i></button></td></tr>';
    $(o).append(html); uploadFileSetData(settings.modid, nm);
},

uploadFileDelItem = function (nm, id) {
    $('#uplFiles_' + nm + settings.modid + ' tbody tr').each(function () { if ($(this).data('file').name == id) { $(this).remove(); } }); uploadFileSetData(settings.modid, nm);
},

uploadFileSetData = function (nm) {
    var ds = [], resData = '', tol = 0;
    $('#uplFiles_' + nm + settings.modid + ' tbody tr').each(function () { var d = $(this).data('file'); if (d) { ds.push(d); } });
    resData = JSON.stringify(ds); if (resData == '[]') { resData = ''; } $('#frmVal_' + nm + settings.modid).val(resData);
    if (resData != '') { tol = ds.length; } $('#uplFiles_Total_' + nm + settings.modid).html(tol);
},

showErrorAlert = function () {
    var h = '<div id="errorAlertPane' + settings.modid + '" class="alert alert-danger fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">?</button><h4>Внимание</h4><p>Произошла ошибка.</p></div>';
    hideAlert(settings.modid); $('#formPane' + settings.modid).before(h);
},

showSuccessAlert = function () {
    var h = '<div id="successAlertPane' + settings.modid + '" class="alert alert-success fade in" style="margin:0;"><h4>Успешно!</h4><p>Ваша анкета сохранена. Для ее рассмотрения требуется подтвердить Вашу аутентичность. Для этого Вам было отправлено электронное письмо с дальнейшими инструкциями.</p><br/><div class="btn-group"><a href="/" class="btn btn-default">Ок</a></div></div>';
    hideAlert(); $('#formPane' + settings.modid).before(h);
},

hideAlert = function () {
    $('#errorAlertPane' + settings.modid).remove(); $('#successAlertPane' + settings.modid).remove();
},

extvalidtext_Valid = function (itm) {
    var o = '#frmVal_' + itm.name + settings.modid;
    if ($(o).valid() == false) { return false; }
    var f = { "vmode": itm.vmode, "key": itm.name, "val": $(o).val() }, vmgn = 'validWaitMsg_' + itm.name + settings.modid;
    $(o).resetForm(); $(o).attr('readonly', 'readonly');
    if (!$('#' + vmgn).length || $('#' + vmgn).length == 0) { $('#ctrPane_' + itm.name + settings.modid).append('<em id="' + vmgn + '" style="display: block;"><i class="fa fa-exclamation-triangle"></i> Подождите, идет проверка...</em>'); }

    $.getJSON(itm.validatorurl + '&jsoncallback=?', f, function (data) {
        $('#' + vmgn).remove(); $(o).removeAttr('readonly');
        $.map(data, function (item) {
            if (item.isvalid == false) {
                $(o).parent().addClass('state-error').removeClass('state-success');
                $('em[for="frmVal_' + itm.name + settings.modid + '"]').remove();
                $(o).parent().parent().append('<em for="frmVal_' + itm.name + settings.modid + '" class="invalid" style="display: block;">' + itm.errvalidmsg + '</em>');
            }
        });
    });
},

clearAdvList = function (panename) {
    var o = '#frmVal_' + panename + settings.modid; parentname = $(o).data('parentname'); if (!parentname) { parentname = ''; }
    if (parentname != '') { $(o).html('<option value=""></option>'); }
    $(o).val('').trigger('chosen:updated'); $(o).valid();
},

getUrlAdvList = function (panename) {
    var parentname = $('#frmVal_' + panename + settings.modid).data('parentname'); if (!parentname) { parentname = ''; }
    return '/desktopmodules/ows/im.aspx?_OWS_=m:dnn_owsAppSrc,id:14032023-5508-0597-AC76-50E6C8A72BA3&srcname=' + panename + (parentname != '' ? '&pfltr=' + $('#frmVal_' + parentname + settings.modid).val() : '');
},

extList_Load = function (panename, srcname, pid) {
    var o = '#frmVal_' + panename + settings.modid; $(o).html(''), f = { "srcname": srcname, "pid": pid };
    $.getJSON(settings.extListSrcUrl + '&jsoncallback=?', f, function (data) {
        $(o).append('<option value=""></option>'); $.map(data, function (item) { $(o).append('<option value="' + item.id + '">' + item.title + '</option>'); });
        extList_Fill(panename);
    });
},

extList_Fill = function (panename) {
    var d = $('#formPane' + settings.modid).data('form');
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $.each(d, function (i, itm) {
        if (itm.type == 'extlist' && itm.name == panename) { var v = itm.value; if (v) { $('#frmVal_' + panename + settings.modid).val(v); $('#frmVal_' + panename + settings.modid).change(); $('#frmVal_' + panename + settings.modid).valid(); } return; }
    });
},

initForm = function (ro) {
    var d = settings.dataForm;
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $(settings.formid).validate({ errorElement: 'em', errorClass: 'invalid', errorPlacement: function (error, element) { var o = $(element).parent(), isIgnor = false; if ($(element).attr('id') == 'undefined') { isIgnor = true; } if ($(element).hasClass('ignore')) { isIgnor = true; } var disattr = $(element).attr('disabled'), roattr = $(element).attr('readonly'); if (typeof disattr !== typeof undefined && disattr !== false) { isIgnor = true; } if (typeof roattr != typeof undefined && roattr !== false) { isIgnor = true; } if (isIgnor) { return; } error.insertAfter(element.parent()); }, highlight: function (element, errorClass, validClass) { var o = $(element).parent(), isIgnor = false; if ($(element).attr('id') == 'undefined') { isIgnor = true; } if ($(element).hasClass('ignore')) { isIgnor = true; } var disattr = $(element).attr('disabled'), roattr = $(element).attr('readonly'); if (typeof disattr !== typeof undefined && disattr !== false) { isIgnor = true; } if (typeof roattr != typeof undefined && roattr !== false) { isIgnor = true; } if (isIgnor) { o.removeClass('state-error').removeClass('state-success'); return; } o.addClass('state-error').removeClass('state-success'); var o2 = $('#' + $(element).attr('id') + '_chosen a'); o2.removeClass('state-success').addClass('state-error') }, unhighlight: function (element, errorClass, validClass) { if ($(element).attr('id') == 'undefined') { return; } if ($(element).hasClass('ignore')) { return; } var o = $(element).parent(); o.removeClass('state-error').addClass('state-success'); var o2 = $('#' + $(element).attr('id') + '_chosen a'); o2.removeClass('state-error'); if ($(element).val().trim() != '') { o2.addClass('state-success'); } } });
    $.each(d, function (i, itm) {
        var pObj = $('#fldPane_' + itm.name + settings.modid).parent(), defVsl = true, defEnbl = true;
        if (itm.hasOwnProperty('visible')) { defVsl = itm.visible; }
        if (itm.hasOwnProperty('enable')) { defEnbl = itm.enable; }
        if (pObj.length) {
            if (itm.type == 'text') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + '" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + '">';
                html += '<input type="text" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'extvalidtext') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + '" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + '">';
                html += '<div class="input-group">';
                if (itm.hasOwnProperty('leftsubtitle')) { if (itm.leftsubtitle != '') { html += '<div class="input-group-addon">' + itm.leftsubtitle + '</div>'; } }
                html += '<input type="text" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' readonly="readonly"' : '') + (defEnbl == false ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                if (itm.hasOwnProperty('rightsubtitle')) { if (itm.rightsubtitle != '') { html += '<div class="input-group-addon">' + itm.rightsubtitle + '</div>'; } }
                html += '</div>';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { extvalidtext_Valid(itm); if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); }  settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
                $('#frmVal_' + itm.name + settings.modid).rules("add", { regex: "^[a-zA-Z'.\\s]{1,40}$" })
            }
            if (itm.type == 'multitext') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="textarea">';
                html += '<textarea rows="' + itm.rows + '" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + '>' + (itm.defval ? itm.defval : '') + '</textarea>';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); }  settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'rangeslider') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + '" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input' + (defEnbl == false ? ' state-disabled' : '') + '">';
                html += '<input type="hidden" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (itm.defval ? ' value="' + itm.defval + '"' : '') + ' />';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).ionRangeSlider(itm.options);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); }  settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'email') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input">';
                html += '<i class="icon-append fa fa-envelope"></i>';
                html += '<input type="text" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'phone') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input">';
                html += '<i class="icon-append fa fa-phone"></i>';
                html += '<input type="text" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + (itm.plcholder ? ' placeholder="' + itm.plcholder + '"' : '') + (itm.maxlen != '0' ? ' maxlength="' + itm.maxlen + '"' : '') + ' />';
                html += '</label></div>';
                pObj.html(html);
                if (itm.mask) { $('#frmVal_' + itm.name + settings.modid).mask(itm.mask, { placeholder: 'X' }); }
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }

            if (itm.type == 'date') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>';
                html += '<label class="input">';
                html += '<i class="icon-append fa fa-calendar"></i>';
                html += '<input type="text" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' value="' + itm.defval + '"' : '') + '/>';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).datepicker({ dateFormat: 'dd.mm.yy', prevText: '<i class="fa fa-chevron-left"></i>', nextText: '<i class="fa fa-chevron-right"></i>' });
                $('#frmVal_' + itm.name + settings.modid).datepicker($.datepicker.regional['ru']);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'list') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>', d1 = itm.listdata;
                html += '<label class="select">';
                html += '<select id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + '>';
                html += '<option value=""></option>';
                $.each(d1, function (i2, itm2) { html += '<option value="' + itm2.value + '"' + (itm.defval == itm2.value ? ' selected="selected"' : '') + (itm2.dis ? ' disabled="disabled"' : '') + '>' + itm2.title + '</option>'; });
                html += '</select>';
                html += '<i></i>';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }

            if (itm.type == 'extlist') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>', d1 = itm.listdata;
                html += '<label class="select">';
                html += '<select id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"' + '>';
                html += '</select>';
                html += '<i></i>';
                html += '</label></div>';
                pObj.html(html);
                if (itm.listautoload) { setControlListData(itm.name, itm.listsrcname, null); }
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }

            if (itm.type == 'advlist') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="label" for="frmVal_' + itm.name + settings.modid + '">' + itm.title + '</label>', d1 = itm.listdata;
                html += '<label class="select">';
                html += '<select id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '" data-type="advlist"' + (itm.plcholder ? ' data-placeholder="' + itm.plcholder + '"' : 'data-placeholder=" "') + (itm.parentname != '' ? ' data-parentname="' + itm.parentname + '"' : '') + '>';
                html += '<option value=""></option>';
                $.each(d1, function (i2, itm2) { html += '<option value="' + itm2.id + '">' + itm2.title + '</option>'; });
                html += '</select>';
                html += '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).ajaxChosen({ dataType: 'json', type: 'POST', url: '' }, { loadingImg: '/images/loading16.gif', minLength: 2, generateUrl: function (q) { return getUrlAdvList(itm.name); } }, { width: "100%", no_results_text: 'Не найдено из: ', allow_single_deselect: true });
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { $(this).valid(); if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); }  settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
                if (itm.parentname != '') { $('#frmVal_' + itm.parentname + settings.modid).on('change', function () { clearAdvList(itm.name); }); }
            }

            if (itm.type == 'chek') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                html += '<label class="checkbox"><input type="checkbox" id="frmVal_' + itm.name + settings.modid + '" value="1" name="frmVal_' + itm.name + settings.modid + '"' + (ro ? ' disabled="disabled"' : '') + (itm.defval ? ' checked="checked"' : '') + '><i></i>' + itm.title + '</label></div>';
                pObj.html(html);
                $('#frmVal_' + itm.name + settings.modid).on('change', function () { if (itm.hasOwnProperty('triggers')) { triggerFldProc(itm.triggers, $(this).val()); } settings.onChange.call(this); if (itm.srchble) { settings.onChange_SrchbleFld.call(this); } else { settings.onChange_NotSrchbleFld.call(this); } });
            }
            if (itm.type == 'attachfiles') {
                var html = '<div id="ctrPane_' + itm.name + settings.modid + '" data-visible="' + defVsl + '" data-enable="' + defEnbl + '"' + (defVsl == false ? ' style="display:none;"' : '') + '>';
                if (itm.title != '') { html += '<label class="label' + (defEnbl == false ? ' state-disabled' : '') + '">' + itm.title + '</label>'; }
                if (itm.hasOwnProperty('infotext')) { if (itm.infotext != '') { html += '<div class="alert alert-info fade in" style="margin:5px 0;">' + itm.infotext + '</div>'; } }
                html += '<table id="uplFiles_' + itm.name + settings.modid + '" class="table table-bordered table-striped" style="width:100%;">';
                html += '<thead style="background:#ECECEC;">';
                html += '<tr><th style="width:30px;"></th><th>' + settings.localzRes.uplFilesFileText + '</th><th style="width:50px;"></th></tr>';
                html += '</thead>';
                html += '<tbody></tbody>';
                html += '<tfoot style="background:#ECECEC;font-weight:bold;">';
                html += '<tr>';
                html += '<td colspan="3">' + settings.localzRes.uplFilesTotalText + ' <span id="uplFiles_Total_' + itm.name + settings.modid + '" class="badge rounded-2x badge-light" style="font-size: 13px;">0</span></td>';
                html += '</tr>';
                html += '</tfoot>';
                html += '</table>';
                html += '<div class="input-group">';
                html += '<button id="uplFiles_Button_' + itm.name + settings.modid + '" type="button" class="btn-u" onclick="uploadFileOpenEditor(\'' + itm.name + '\')">&nbsp<i class="fa fa-plus"></i>&nbsp</button>';
                html += '</div>';
                html += '<input type="hidden" id="frmVal_' + itm.name + settings.modid + '" name="frmVal_' + itm.name + settings.modid + '"> ';
                pObj.html(html);
            }

            if (itm.hasOwnProperty('enable')) { setControlEnable(itm.name, itm.enable); } else { setControlEnable(itm.name, true); }
            if (itm.hasOwnProperty('validrule')) { if (itm.validrule.length != 0) { $('#frmVal_' + itm.name + settings.modid).rules('remove'); $('#frmVal_' + itm.name + settings.modid).rules('add', itm.validrule); } }
        }
    });
    //fillForm(ro);
},
setControlVal = function (nm, val) {
    var d = settings.dataForm;
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $.each(d, function (i, itm) {
        var o = '#frmVal_' + itm.name + settings.modid;
        if (itm.name == nm) {
            if (itm.type == 'text' || itm.type == 'list' || itm.type == 'extlist') {
                $(o).val(val);/* $(o).change();*/ /*$(o).valid(); $(settings.formid).valid();*/
            }
            return false;
        }
    });
},
setControlListData = function (nm, pval) {
    var d = settings.dataForm;
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $.each(d, function (i, itm) {
        if (itm.name == nm) {
            if (itm.type == 'extlist') {
                var srcurl = settings.extListSrcUrl, o = '#frmVal_' + itm.name + settings.modid, f = { "srcname": itm.listsrcname, "pid": pval }, autoload = true;
                if (itm.listsrcurl != '') { srcurl = itm.listsrcurl; }
                if (!pval || pval == '') { if (itm.hasOwnProperty('listautoload')) { if (!itm.listautoload) { autoload = false; } } else { autoload = false; } }
                $(o).val(''); $(o).html('');
                if (!autoload) { setControlEnable(itm.name, false); return false; }
                $.getJSON(srcurl + '&jsoncallback=?', f, function (data) {
                    var isexitdata = true; if (!data || typeof data != 'object') { isexitdata = false; } if (data.length == 0) { isexitdata = false; }
                    if (!isexitdata) { setControlEnable(itm.name, false); } else {
                        $(o).append('<option value=""></option>'); $.map(data, function (item) { $(o).append('<option value="' + item.id + '">' + item.title + '</option>'); });
                    }
                    setControlVal(itm.name, '');
                });
            }
            return false;
        }
    });
},
setControlEnable = function (nm, v) {
    var d = settings.dataForm;
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $.each(d, function (i, itm) {
        if (itm.name == nm) {
            if (itm.type == 'text' || itm.type == 'list' || itm.type == 'extlist') {
                if (v) {
                    $('#ctrPane_' + itm.name + settings.modid + ' label.label').removeClass('state-disabled');
                    $('#ctrPane_' + itm.name + settings.modid + ' label.input').removeClass('state-disabled');
                    $('#frmVal_' + itm.name + settings.modid).removeAttr('disabled');
                } else {
                    $('#ctrPane_' + itm.name + settings.modid + ' label.label').addClass('state-disabled');
                    $('#ctrPane_' + itm.name + settings.modid + ' label.input').addClass('state-disabled');
                    $('#frmVal_' + itm.name + settings.modid).attr('disabled', 'disabled');
                }
            }
            //$('#frmVal_' + itm.name + settings.modid).val(''); $('#frmVal_' + itm.name + settings.modid).change(); $('#frmVal_' + itm.name + settings.modid).valid(); $(settings.formid).valid();
            return false;
        }
    });
},
setControlVisible = function (nm, v) {
    var d = settings.dataForm;
    if (!d || typeof d != 'object') { return; } if (d.length == 0) { return; }
    $.each(d, function (i, itm) {
        if (itm.name == nm) {
            if (itm.hasOwnProperty('visible')) { if (itm.visible == false) { return false; } }
            var pfxvs = ''; if (v) { pfxvs = ''; } else { pfxvs = 'none'; } $('#ctrPane_' + itm.name + settings.modid).css('display', pfxvs); $('#frmVal_' + itm.name + settings.modid).val('');
            return false;
        }
    });

},
fillForm = function (ro) {
    var df = settings.dataForm, v = null;
    if (!df || typeof df != 'object') { return; } if (df.length == 0) { return; }

    $.each(df, function (i, itm) {
        if (itm.type == 'text' || itm.type == 'extvalidtext' || itm.type == 'multitext' || itm.type == 'email' || itm.type == 'phone' || itm.type == 'date' || itm.type == 'list') {
            v = null;
            if (itm.hasOwnProperty('value')) {
                if (itm.value != '') { v = itm.value; }
            }
            if (!v) {
                if (itm.hasOwnProperty('defval')) {
                    if (itm.defval != '') { v = itm.defval; }
                }
            }
            if (v == '') { v = null; }
            if (v) { $('#frmVal_' + itm.name + settings.modid).val(v); $('#frmVal_' + itm.name + settings.modid).change(); }
            else { if (itm.hasOwnProperty('triggers')) { if (itm.triggers.length > 0) { $('#frmVal_' + itm.name + settings.modid).change(); } } }
            $('#frmVal_' + itm.name + settings.modid).valid();
        }
        if (itm.type == 'advlist') {
            var d = itm.value, isEmpty = true, isExt = false;
            if (d && typeof d == 'object') { if (d.length != 0) { isEmpty = false; } }
            if (isEmpty == false) {
                $('#frmVal_' + itm.name + settings.modid + ' option[value="' + d[0].id + '"]').each(function () { isExt = true; return; });
                if (!isExt) { $('#frmVal_' + itm.name + settings.modid).append('<option value="' + d[0].id + '">' + d[0].title + '</option>'); }
                $('#frmVal_' + itm.name + settings.modid).val(d[0].id);
                $('#frmVal_' + itm.name + settings.modid).trigger('chosen:updated');
                $('#frmVal_' + itm.name + settings.modid).change();
            }
        }
        if (itm.type == 'chek') {
            v = itm.value; if (v == '') { v = null; }
            if (v) {
                if (v == "1") { $('#frmVal_' + itm.name + settings.modid).prop('checked', true); } else { $('#frmVal_' + itm.name + settings.modid).prop('checked', false); }
                $('#frmVal_' + itm.name + settings.modid).change();
            }
        }
    });
},
showForm = function () {
    $('#formPane' + settings.modid).removeAttr('style');
},
triggerFldProc = function (tr, vl) {
    var hasTr = false;
    $.each(tr, function (i1, tritm) {
        if (!tritm.onval && tritm.onval == vl) {
            if (tritm.hasOwnProperty('controls')) {
                $.each(tritm.controls, function (i2, trcntritm) {
                    setControlEnable(trcntritm.name, trcntritm.enable);
                    setControlVisible(trcntritm.name, trcntritm.visible);
                    if (trcntritm.updatelistdata == true) { setControlListData(trcntritm.name, vl); }
                });
            }
            hasTr = true; return false;
        }
    });
    if (hasTr == false) {
        $.each(tr, function (i1, tritm) {
            if (tritm.val == null) {
                if (tritm.hasOwnProperty('controls')) {
                    $.each(tritm.controls, function (i2, trcntritm) {
                        setControlEnable(trcntritm.name, trcntritm.enable);
                        setControlVisible(trcntritm.name, trcntritm.visible);
                        if (trcntritm.updatelistdata == true) { setControlListData(trcntritm.name, vl); }
                    });
                }
                return false;
            }
        });
    }
},
getFormData = function (isRaw) {
    if (!isRaw) { if (!$(settings.formid).valid()) { return null; } }
    var df = settings.dataForm, v = null;
    if (!df || typeof df != 'object') { return null; } if (df.length == 0) { return null; }
    $.each(df, function (i, itm) {       
        if (itm.type == 'text' || itm.type == 'multitext' || itm.type == 'rangeslider' || itm.type == 'email' || itm.type == 'phone' || itm.type == 'date' || itm.type == 'list' || itm.type == 'extlist') {
            v = $('#frmVal_' + itm.name + settings.modid).val();
        }
        if (itm.type == 'advlist') {
            v = $('#frmVal_' + itm.name + settings.modid).val();
        }
        if (itm.type == 'chek') {
            v = $('#frmVal_' + itm.name + settings.modid).attr('checked') ? "1" : "0";
        }
        if (itm.type == 'attachfiles') {
            var atch = $('#frmVal_' + itm.name + settings.modid).val();
            if (atch != '') { v = $.parseJSON($('#frmVal_' + itm.name + settings.modid).val()); }
        }
        if (v == null) { v = '';}
        itm.value = v;
    });
    return df;
},
getSrchbleFormData = function (isRaw,isFull) {
    if (!isRaw) { if (!$(settings.formid).valid()) { return null; } }
    var fvd = getFormData(isRaw);
    if (!fvd || typeof fvd != 'object') { return null; } if (fvd.length == 0) { return null; }
    var fvd_res = [];
    $.each(fvd, function (i, itm) {        
        if (itm.srchble) { if (isFull) { fvd_res.push(itm); } else { var d = { "name": itm.name, "val": itm.value }; fvd_res.push(d); } }
    });
    return fvd_res;
};
})(jQuery);