/*
 * Project: AgeManEditor
 * Version: 1.0.0
 * Author: dnn.site
 * Website: http://dnn.site
*/
(function ($) {
    var defaults = {
        localzRes: {
            'child1_Title': 'Select age of the 1st child'
            , 'child2_Title': 'Select age of the 2st child'
            , 'child1_Caption': 'The 1st child {1} years'
            , 'child2_Caption': 'The 2st child {1} years'
            , 'noChildrenText': 'Without children'
            , 'select2stChildText': 'Select 2st Child'
            , 'noText': 'No'
            , 'uplFilesTotalText': 'Total'
            , 'uplFilesFileText': 'File'
        }
                , formId: 'form'
                , modId: ''
		, onChange: function () { }
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                widgetObj = this; 
                initWidget();
            });
        }
        , getValue: function () { return getValue(); }
        , setValue: function (v) { setValue(v); }
        , getShortFormData: function (isRaw, noEmpty) { return getShortFormData(isRaw, noEmpty); }
        , fillForm: function (d) { fillForm(convertToFormData(d)); }
        , clearForm: function () { clearForm(); }
    };

    $.fn.agemaneditor = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.ageManEditor');
        }
    }

    var widgetObj, initWidget = function () {        
        var widgetId = $(widgetObj).attr('id');
        var vSelsData = [{ value: '', text: settings.localzRes.noText }, { value: '0', text: '0' }, { value: '1', text: '1' }, { value: '2', text: '2' }, { value: '3', text: '3' }, { value: '4', text: '4' }, { value: '5', text: '5' }, { value: '6', text: '6' }, { value: '7', text: '7' }, { value: '8', text: '8' }, { value: '9', text: '9' }, { value: '10', text: '10' }, { value: '11', text: '11' }, { value: '12', text: '12' }, { value: '13', text: '13' }, { value: '14', text: '14' }];
        var html = '<div id="' + widgetId + '" data-val1="' + getLocalValue(1) + '" data-val2="' + getLocalValue(2) + '">';
        html += '<a href="#" id="' + widgetId + '_chld1" data-name="' + widgetId + '_chld1" data-type="select" data-value="' + getLocalValue(1) + '" data-emptytext="' + settings.localzRes.noChildrenText + '" data-source="" class="editable-click" title="' + settings.localzRes.child1_Title + '">' + settings.localzRes.noChildrenText + '</a>';
        html += '<a href="#" id="' + widgetId + '_chld2" data-name="' + widgetId + '_chld2" data-type="select" data-value="' + getLocalValue(2) + '" data-emptytext="" data-source="" class="editable-click" title="' + settings.localzRes.child2_Title + '"></a>';
        html += '</div>';
        $(widgetObj).replaceWith(html);
        widgetObj = $('#' + widgetId);
        $('#' + widgetId + '_chld1').attr('data-source', JSON.stringify(vSelsData));
        $('#' + widgetId + '_chld2').attr('data-source', JSON.stringify(vSelsData));

        $('#' + widgetId+'_chld1').editable({            
              pk: 1 
            , placement: "bottom"
            ,savenochange:true
            , success: function (response, newValue) {
                var v = newValue;
                if (v == '') {
                    v = $('#' + widgetId + '_chld2').editable('getValue', true);
                    $('#' + widgetId + '_chld2').editable('setValue', ''); $('#' + widgetId).data('val2', '');
                }
                $('#' + widgetId).data('val1', v);saveValue();
                settings.onChange.call(this);
                return { newValue: v };
            }
            , display: function (value) {                    
                    if (value != '') {
                        $(this).text(settings.localzRes.child1_Caption.replace('{1}', value));
                        if ($('#' + widgetId).data('val2') == '') {
                            $('#' + widgetId + '_chld2').html(', ' + settings.localzRes.select2stChildText);
                        }
                    }
                    else {
                        $(this).text(settings.localzRes.noChildrenText);
                         $('#' + widgetId + '_chld2').html('');
                    }                    
            }
        });

        $('#' + widgetId + '_chld2').editable({            
              pk: 1
            , placement: "bottom"
            , success: function (response, newValue) {
                var v = newValue;
                $('#' + widgetId).data('val2', v);saveValue();
                settings.onChange.call(this);
            }
            , display: function (value) {               
                if (value != '') {
                     $(this).text(', ' + settings.localzRes.child2_Caption.replace('{1}', value));
                }
                else {
                    if ($('#' + widgetId + '_chld1').editable('getValue', true) == '') { $(this).text(''); } else {
                        $(this).text(', ' + settings.localzRes.select2stChildText);
                    }
                }                
            }
        });
    }
    , getValue = function (p) {        
        var v=settings.value,ch1 = '', ch2 = '';
        if (p == null) { return v; }
        var arrV = eval('[' + v + ']');
        if ($.isArray(arrV)) {
            ch1 = arrV[0]; if (arrV.length > 1) { ch2 = arrV[1]; }
        }
        else { ch1 = arrV; }
        if (isNaN(ch1) == true) { ch1 = '' }
        if (isNaN(ch2) == true) { ch2 = '' }
        if (p == 1) { return ch1;}
        if (p == 2) { return ch2; }

    }
    , getLocalValue = function (p) {        
        var v = settings.value, ch1 = '', ch2 = '';
        if (p == null) { return v; }
        var arrV = eval('[' + v + ']');
        if ($.isArray(arrV)) {
            ch1 = arrV[0]; if (arrV.length > 1) { ch2 = arrV[1]; }
        }
        else { ch1 = arrV; }

        if (isNaN(ch1) == true) { ch1 = '' }
        if (isNaN(ch2) == true) { ch2 = '' }

        if (p == 1) { return ch1; }
        if (p == 2) { return ch2; }

    }
    , saveValue = function () {        
        var r = '', widgetId = $(widgetObj).attr('id'), ch1 = $('#' + widgetId).data('val1'), ch2 = $('#' + widgetId).data('val2');
        if (ch1 != '') {
            if (ch2 == '') { r=ch1; } else { r= ch1 + ',' + ch2; }
        }
        settings.value = r;
    }
    , setValue = function (v) {
        var widgetId = $(widgetObj).attr('id'),ch1 = '', ch2 = '';
        arrV = eval('['+ v +']');        
        if ($.isArray(arrV)) {ch1 = arrV[0]; if (arrV.length > 1) { ch2 = arrV[1]; }}
        else { ch1 = arrV; }
        if (isNaN(ch1) == true) { ch1 = '' }
        if (isNaN(ch2) == true) { ch2 = '' }
        $('#' + widgetId + '_chld1').editable('setValue', ch1);
        $('#' + widgetId + '_chld2').editable('setValue', ch2);
        $('#' + widgetId).data('val1', ch1);
        $('#' + widgetId).data('val2', ch2);
        saveValue();
        settings.onChange.call(this);       
    };
})(jQuery);