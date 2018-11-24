/*
 * Project: BBS.AccountAgreeSelector
 * Version: 1.2
 * Author: dnn.site
 * Website: http://dnn.site
 * 
 * 
 *ajax data: {"total_count":1,"incomplete_results":false,"items":[{"id":"","title":"","subtitle":"","icnurl":""}]}
*/
(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select item...'}
        ,dVal:null
        ,modId:''                        
        ,listSrcUrl:''            
        ,listSrcApiKey:''
        ,listData:[]
        ,filterByTypes:null
        ,filterByKind:null
        ,minimumResultsForSearch:10
        ,allowClear:true
        ,onChange:function(){}
    }    
    ,methods={
        init:function(options){            
            var settings={};
            return this.each(function(){
                settings=$.extend(true,{},defaults,options);                    
                $(this).data("settings",settings);
                initWidget(this);
            });
        } 
        ,getValue:function(){return getValue();}
        ,clearValue:function(){clearFile();}        
    };

    $.fn.bbsAccAgreeSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsAccAgreeSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',pObj=$($this),objId=$($this).attr('id'),dVal=settings.dVal;        
        //html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+(dVal?dVal:'')+'"></select>';
        pObj.attr('name',pObj.attr('id'));
        pObj.attr('class','form-control select2-single');
        pObj.data('val',(dVal!=null ? dVal : ''));
        //pObj.append(html);
        $(pObj).select2({
            theme:'bootstrap'
            ,ajax:getListData($this)
            ,data:settings.listData
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,placeholder:settings.localzRes.fldSelectorPlaceholderText
            ,templateResult:getResultTemp
            ,templateSelection:getSelectionTemp 
            ,allowClear:settings.allowClear
        });        
        //$('#frmAccountGUID'+settings.modId).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
        //loadAccountList($this);
    }
    ,getListData=function($this){
        var settings=getSettings($this),srcurl=settings.listSrcUrl,apikey=settings.listSrcApiKey;
        if(!srcurl||!apikey){return null}
        //console.log('Loading.........');
        return{
             url:srcurl
             //url:srcurl+'&jsoncallback=?'
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            //,async:false
            ,data:function(p){
                return{
                     skey:p.term
                    ,pg:p.page
                    ,apikey:apikey
                    ,kind:settings.filterByKind
                    ,acctps:settings.filterByTypes
                };
            }
            ,processResults:function(data,p){
                p.page=p.page || 1;
                //console.log(p,data);
                console.log('processResults');
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
            ,success:function(data){console.log('success');}
        };
    }
    /*,loadAccountList=function($this){
        var settings=getSettings($this),o='#frmAccountGUID'+settings.modId,f={"srcname":settings.listSrcName,"dlrtp":settings.filterByTypes},dVal=$(o).data('val'),isSel=false;                
        $(o).html('');$(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
                $(o).append('<option value="">&nbsp</option>');               
                $.map(data,function(item){                    
                    if(item.id==dVal){isSel=true}else{isSel=false;}                    
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });                
            }
        });   
    } */  
    ,getResultTemp=function(s){
        /*console.log('sss1 ',s);*/
        if (!s.id||s=='') {return s.text;}
        //var d=$(s.element).data('meta');
        var d=s;
        if (!d||typeof d!='object'){return s.text;}         
        s.text=s.title;
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    }    
    ,getSelectionTemp=function(s){        
        /*console.log('sss2 ',s);*/
        if (!s.id||s=='') {return s.text;}
        //var d=$(s.element).data('meta');
        var d=s; if (!d||typeof d!='object'){return s.text;}        
        s.text=s.title;
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';        
        return m;
    }
    ,hideSelection=function(selectedObject){return false;}
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;};
})(jQuery);