/*
 * Project: BBS.AccountAgreeSelector
 * Version: 1.0
 * Author: dnn.site
 * Website: http://dnn.site
*/
(function ($){
    var defaults={
        localzRes: {                             
            fldSelectorPlaceholderText:'Select item...'            
        }
            ,dVal:null
            ,modId:''                        
            ,listSrcUrl:''            
            ,listSrcName:''
            ,filterListByTypeAcc:null
            ,minimumResultsForSearch:10
            ,allowClear:true
            ,onChange:function(){}
    },settings,
    methods={
        init:function(options){
            settings=$.extend(defaults,options);
            return this.each(function(){
                paneId=$(this).attr('id');
                initWidget();
            });
        }
        ,getValue:function(isRaw){return getValue(isRaw);}
        ,clearValue:function(){clearFile();}        
    };
    $.fn.bbsAccAgreeSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if (typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsAccAgreeSelector');
        }
    }
    var paneId
    ,initWidget=function(){
        var html='',pObj=$('#'+paneId),dVal=settings.dVal;
        html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+(dVal?dVal:'')+'"></select>';
        //pObj.replaceWith(html);
        pObj.append(html);
        $('#frmAccountGUID'+settings.modId).select2({
            theme:'bootstrap'
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,placeholder:settings.localzRes.fldSelectorPlaceholderText
            ,templateResult:getResultTemp
            ,templateSelection:getSelectionTemp 
            ,allowClear:settings.allowClear
        });
        $('#frmAccountGUID'+settings.modId).on('change',function(){
            var v=$(this).val();$(this).data('val',v);
            //settings.onChange.call(undefined,v);            
            settings.onChange.call(this,v);
        });
        loadAccountList();
    }
    ,loadAccountList=function(){
        var o='#frmAccountGUID'+settings.modId,f={"srcname":settings.listSrcName,"dlrtp":settings.filterListByTypeAcc},dVal=$(o).data('val'),isSel=false;                
        $(o).html('');$(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
                $(o).append('<option value="">&nbsp</option>');               
                $.map(data,function(item){
                    if(item.id==dVal&&isSel==false){isSel=true;}                                        
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });                
            }
        });   
    }   
    ,getResultTemp=function(s){        
        if (!s.id) {return s.text;}        
        var d=$(s.element).data('meta');
        if (!d||typeof d!='object'){return s.text;} 
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    }
    ,getSelectionTemp=function(s){        
        var d=$(s.element).data('meta');
        if (!d || typeof d!='object'){return s.text;} 
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';        
        return m;
    }
    ,hideSelection=function(selectedObject){return false;}
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;};
})(jQuery);