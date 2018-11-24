/*
 * Project: BBS.MDEditor
 * Version: 1.0
 * Author: dnn.site
 * Website: http://dnn.site 
*/
(function ($){
    var defaults={
         localzRes:{
             mdLocalzRes:null
            ,btnAddMDItemTitle:''
         }
         ,title:''
         ,description:''
         ,formData:[]
         ,listData:[]
         ,currencyData:[]
         ,currencyId:'840' 
        ,dVal:null
        ,modId:''
        ,listSrcUrl:''
        ,listSrcApiKey:''        
        ,HTMLTemplate:''
        ,separator:'<hr>'
        ,disabled:false
        ,maxItems:0
        ,minItems:1
        ,panelEnable:false
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
        ,getFormData:function(validIgrore){return getFormData(this,validIgrore);}
        ,getShortFormData:function(validIgrore,noEmpty){return getValueData(this,validIgrore,noEmpty);}
        ,getValueData:function(validIgrore,noEmpty){return getValueData(this,validIgrore,noEmpty);}
        ,fillForm:function(d){this.each(function(){fillForm(this,convertToFormData(this,d));});}
        ,clearForm:function(){this.each(function(){clearForm(this);});}
    };

    $.fn.bbsMDEditor=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsMDEDitor');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',wdgt=$($this),wdgtId=$($this).attr('id'),dVal=settings.dVal,html='',srsUrl=null;
        html+='<div class="panel panel-default">';
        html+='<div class="panel-heading"><h3 class="panel-title">'+settings.title+'</h3><small>'+settings.description+'</small></div>';
        html+='<div id="'+wdgtId+'_mdeditorpane" class="panel-body" data-totalitems="0"></div>';
        html+='<div class="panel-footer">';
        console.log("html: ",html); 
        if(settings.disabled==false){html+='<button type="button" id="'+wdgtId+'_btnAddMDItem" class="btn btn-primary btn-xs"><i class="fa fa-plus"></i> '+settings.localzRes.btnAddMDItemTitle+'</button>';}
        html+='</div>';
        html+='</div>';
        $($this).append(html);
        if(settings.disabled==false){$('#'+wdgtId+'_btnAddMDItem').on('click',function(){addMDItem($this);});}
        for(var i=1;i<=settings.minItems;i++){addMDItem($this);}
    }
    ,addMDItem=function($this){

console.log('settings.HTMLTemplate: ',settings.HTMLTemplate);

        var settings=getSettings($this),wdgtId=$($this).attr('id'),html='',l=0,itmObjId='';        
        l=$('#'+wdgtId+'_mdeditorpane').data('totalitems');if(l==null){l=0;}l+=1;
        itmObjId=wdgtId+'_mditem'+l;if(settings.maxItems>0&&settings.maxItems<l){return;}        
        html+='<div id="'+itmObjId+'">';
        if(l>1){html+=settings.separator;}
        html+='<div class="sky-form">777';
        if(settings.disabled==false&&settings.minItems<l){html+='<div class="clearfix"><button type="button" data-action="'+wdgtId+'_delmditem" data-itmid="'+l+'" class="btn btn-sm pull-right"><i class="fa fa-trash"></i></button></div>';}
        html+=settings.HTMLTemplate.replace(/\{0\}/g,settings.modId+l); +'</div></div>'; 
        $('#'+wdgtId+'_mdeditorpane').append(html);
        $('#'+wdgtId+'_mdeditorpane').data('totalitems',l);
        if(settings.disabled==false){$('button[data-action="'+wdgtId+'_delmditem"]').on('click',function(){delMDItem($this,$(this).data('itmid'));});}
        $('#'+itmObjId).fastForm({
            localzRes:settings.localzRes.mdLocalzRes 
            ,formId:'#Form'
            ,title:settings.title
            ,modId:settings.modId+l
            ,currencyData:settings.currencyData
            ,currencyId:settings.currencyId
            ,formData:settings.formData
            ,listData:settings.listData
            ,listSrcApiKey:settings.listSrcApiKey            
        });
    }
    ,delMDItem=function($this,id){        
        var settings=getSettings($this),wdgtId=$($this).attr('id');
        console.log('ffff');
        $('#'+wdgtId+'_mditem'+id).remove();
    }    
    ,getFormData=function($this){
        var settings=getSettings($this),wdgtId=$($this).attr('id'),l=0,md=[];
        l=$('#'+wdgtId+'_mdeditorpane').data('totalitems');if(l==null){l=0;}
        if(l==0){return;}        
        for(var i=1;i<=l;i++){
            var d=$('#'+wdgtId+'_mditem'+i).fastForm('getFormData');md.push({item:d});
         }
        return md;
    };
})(jQuery);