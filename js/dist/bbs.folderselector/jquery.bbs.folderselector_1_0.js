/*
 * Project: BBS.FolderSelector
 * Version: 1.0
 * Author: dnn.site
 * Website: http://dnn.site 
*/
(function ($){
    var defaults={
         localzRes:{
            selectorPlaceholderText:'Select folder...'
            ,emptyText:'Without folder'
         }
        ,dVal:null
        ,modId:''
        ,listSrcUrl:''
        ,listSrcApiKey:''
        /*,listData:[]*/
        ,schGuid:null
        ,apiKey:null
        ,ownrAccGuid:null
        ,disabled:false
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
        ,getValue:function(){return getValue(this);}
        ,clearValue:function(){clearFile();}        
    };

    $.fn.bbsFolderSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsFolderSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',wdgt=$($this),wdgtId=$($this).attr('id'),dVal=settings.dVal,html='',srsUrl=null;        
        if(settings.listSrcUrl!=null&&settings.listSrcUrl!=''){srsUrl=settings.listSrcUrl+(settings.schGuid!=null?'&schid='+settings.schGuid:'')+(settings.apiKey!=null?'&apikey='+settings.apiKey:'')+(settings.ownrAccGuid!=null?'&ownraccguid='+settings.ownrAccGuid:'');}
        html+='<a href="#" id="'+wdgtId+'_editable" data-name="'+wdgtId+'_editable" data-emptytext="'+settings.localzRes.emptyText+'" data-source="" class="editable-click" title="'+settings.localzRes.selectorPlaceholderText+'">'+settings.localzRes.selectorPlaceholderText+'</a>';
        if(settings.disabled==false){html+='<button type="button" id="'+wdgtId+'_btnClear" class="btn btn-editable-clear btn-xs" style="display:none"><i class="fa fa-trash"></i></button>';}
        $($this).append(html);
        $('#'+wdgtId+'_editable').editable({
             pk:1 
            ,type:'jstree'
            ,placement:"bottom"
            ,savenochange:true
            ,showbuttons:'bottom'
            ,mode:'popup'
            ,disabled:settings.disabled
            ,editableform:{buttons:'<button type="submit" class="btn btn-primary btn-sm editable-submit"><i class="fa fa-fw fa-check"></i>1</button><button type="button" class="btn btn-default btn-sm editable-cancel"><i class="fa fa-fw fa-times"></i>2</button>'}
            ,success:function(res,nVal){
                settings.onChange.call(this,nVal);
                return{nVal:nVal};
            }
            ,display:function(v){
                if(v){$(this).text(v.pathtitle);$('#'+wdgtId+'_btnClear').show();}
                else{$(this).text(settings.localzRes.emptyText);$('#'+wdgtId+'_btnClear').hide();}
            }
            ,jstree:{
                 srsurl:srsUrl
            }
        });
        if(settings.dVal){$('#'+wdgtId+'_editable').editable('setValue',settings.dVal);$('#'+wdgtId+'_btnClear').show();}
        $('#'+wdgtId+'_btnClear').on('click',function(e){console.log('ddddddddddd');$('#'+wdgtId+'_editable').editable('setValue',null);/*$(this).hide();*/});
    }
    ,getValue=function($this){
        return $('#'+$($this).attr('id')+'_editable').editable('getValue',true);
    };
})(jQuery);