/*
 * Project: BBS.LocationSelector
 * Version: 1.4
 * Author: dnn.site
 * Website: http://dnn.site 
*/
/* Country selector */
(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select country...',language:"en"}
        ,dVal:null
        ,modId:''
        ,listSrcUrl:''
        ,listData:[]        
        ,minimumResultsForSearch:0        
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
        //,clearValue:function(){clearFile();}        
    };

    $.fn.bbsCountryLocationSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsCountryLocationSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',pObj=$($this),objId=$($this).attr('id'),dVal=settings.dVal;        
        //html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+(dVal?dVal:'')+'"></select>';
        pObj.attr('name',pObj.attr('id'));
        pObj.attr('class','form-control select2-single');
        //pObj.data('val',(dVal!=null ? dVal : ''));        
        $(pObj).append('<option value=""></option>');
        $(pObj).select2({
            theme:'bootstrap'
            ,language:settings.localzRes.language
            ,ajax:getListData($this)
            //,data:settings.listData
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,minimumInputLength:1
            ,placeholder:settings.localzRes.fldSelectorPlaceholderText
            ,templateResult:getSelectionAndResultTemp
            ,templateSelection:getSelectionAndResultTemp
            ,allowClear:settings.allowClear
        });
        if(settings.parentControl){if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}}

        if(settings.parentControl){$('#'+settings.parentControl).on('change',function(e){
            $(pObj).html('<option value=""></option>').trigger('change');
            if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}else{$(pObj).prop("disabled",false);}
            });
        }

        $(pObj).on('select2:open',function(e){$('#select2-'+objId+'-results').html('');});

        //$(pObj).on('select2:opening',function(e){return false;});
        //$('#frmAccountGUID'+settings.modId).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
    }
    ,getListData=function($this){
        var settings=getSettings($this),srcurl=settings.listSrcUrl,apikey='6FF51184-77C9-4C5A-B78A-60ACF76D4461';
        if(!srcurl){return null}        
        var ajx={
             url:srcurl             
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            //,async:false
            ,data:function(p){
                return{
                     skey:p.term
                    ,pg:p.page||1
                    ,apikey:apikey                    
                };
            }
            ,processResults:function(data,p){
                p.page=p.page||1;                
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }            
        };        
        return ajx;
    }
    //,getDataElByLevel=function(d,l){var rd;$.each(d,function(i,item){if(item.lvl==l){rd=item;return false;}});return rd;}
    ,getSelectionAndResultTemp=function(s){        
        if (!s.id||typeof d!='object'||s=='') {return s.text;}        
        var m='<div class="select2-result-repository">' +
                    //'<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">'+s.text+'</div>';
        //if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    }
    ,hideSelection=function(selectedObject){return false;}
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;};
})(jQuery);



/* Address selector */
(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select location...',language:"en"}
        ,dVal:null
        ,modId:''                        
        ,listSrcUrl:''            
        /*,listSrcApiKey:''*/
        ,listData:[]
        /*,filterByTypes:null*/
        ,level:null 
        /* 1: Регион
           3: Район
           4: Город
           5: Внутригородская территория
           6: Населенный пункт
           7: Улицы
          90: Дополнительная территория (ГСК, СНТ, лагери отдыха и т.п.)
          91: Улицы на дополнительной территории (улицы, линии, проезды)*/
        /*,filterByKind:null*/
        ,markVisible:true
        ,minimumResultsForSearch:0
        ,minimumInputLength:0
        ,allowClear:true
        ,parentControl:null
        ,fullPathTitleVisible:true
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

    $.fn.bbsAddrLocationSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsAddrLocationSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',pObj=$($this),objId=$($this).attr('id'),dVal=settings.dVal;        
        //html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+(dVal?dVal:'')+'"></select>';
        pObj.attr('name',pObj.attr('id'));
        pObj.attr('class','form-control select2-single');
        //pObj.data('val',(dVal!=null ? dVal : ''));        
        $(pObj).append('<option value=""></option>');

        $(pObj).select2({
            theme:'bootstrap'
            ,language:settings.localzRes.language
            ,ajax:getListData($this)
            //,data:settings.listData
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,minimumInputLength:settings.minimumInputLength
            ,placeholder:settings.localzRes.fldSelectorPlaceholderText
            ,templateResult:getResultTemp
            ,templateSelection:getSelectionTemp 
            ,allowClear:settings.allowClear
            //,initSelection:function(e,c){console.log('initSelection.........');}            
        });

        if(settings.parentControl){if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}}
        
        //.on('change',function(){$('#value').removeClass('select2-offscreen').select2({data:data[$(this).val()],allowClear: true,placeholder: "Select a value"});
        
        //.val('1').trigger('change');
        
        /*on('change', function() {
        $('#value').removeClass('select2-offscreen').select2({data:data[$(this).val()],allowClear: true,placeholder: "Select a value"});
    }).trigger('change');*/



        if(settings.parentControl){$('#'+settings.parentControl).on('change',function(e){
            $(pObj).html('<option value=""></option>').trigger('change');
            if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}else{$(pObj).prop("disabled",false);}
            });
        }

        $(pObj).on('select2:open',function(e){$('#select2-'+objId+'-results').html('');});

        //$(pObj).on('select2:opening',function(e){console.log('select2:opening123');return false;});
        //$('#frmAccountGUID'+settings.modId).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
    }
    ,getListData=function($this){
        var settings=getSettings($this),srcurl=settings.listSrcUrl,apikey='5FF51184-77C9-4C5A-B78A-60ACF76D4459';
        if(!srcurl||!apikey){return null}        
        var ajx={
             url:srcurl
             //url:srcurl+'&jsoncallback=?'
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            //,async:false
            ,data:function(p){
                var pId='';
                if(settings.parentControl){pId=$('#'+settings.parentControl).val();}               
                return{
                     skey:p.term
                    ,pg:p.page||1
                    ,apikey:apikey
                    ,lvl:settings.level
                    ,pid:pId                    
                };
            }
           /* ,transport:function(p){
                console.log('transport.....1: ',p.data.pid);
                console.log('transport.....2: ',p.data.skey);
                if(settings.parentControl&&(p.data.pid==''||p.data.skey=='')){console.log('transport.....3',p);return null;}                
                console.log('transport.....4',p);                
                $.ajax(p);
            }*/
            //,beforeSend:function(e,x){
                //if(ajx!=null){
                   // console.log('Abort.....: ',x);
                    //e.abort();
               // }
            //}
            ,processResults:function(data,p){
                p.page=p.page||1;                
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
            //,success:function(data){console.log('success');}
        };
        return ajx;
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

    ,getDataElByLevel=function(d,l){var rd;$.each(d,function(i,item){if(item.lvl==l){rd=item;return false;}});return rd;}
    ,getResultTemp=function(s){        
        if (!s.id||s==''){return s.text;}
        //var d=$(s.element).data('meta');
        var d=s;
        if (!d||typeof d!='object'){return s.text;}         
        s.text=s.name;
        var tlt='',m='',sep=', ',itm;        
        //if(d.lvl==4 || d.lvl==6){tlt=d.sname+' <mark>'+d.name+'</mark>';}else{tlt=d.name+' '+d.sname;}
        tlt=d.sname+' <mark>'+d.name+'</mark>';
        //if(settings.fullPathTitleVisible){
            if(d.lvl==91){
                itm=getDataElByLevel(d.path,90);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            }
            if(d.lvl==90 || d.lvl==91){
                itm=getDataElByLevel(d.path,7);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            } 
            if(d.lvl==7 || d.lvl==90 || d.lvl==91){
                itm=getDataElByLevel(d.path,6);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            }          
            if(d.lvl==6 || d.lvl==7 || d.lvl==90 || d.lvl==91){
                itm=getDataElByLevel(d.path,5);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            }          
            if(d.lvl==5 || d.lvl==6 || d.lvl==7 || d.lvl==90 || d.lvl==91){
                itm=getDataElByLevel(d.path,4);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            }
            if(d.lvl==4 || d.lvl==5 || d.lvl==6 || d.lvl==7 || d.lvl==90 || d.lvl==91){
                itm=getDataElByLevel(d.path,3);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}
            }
            if(d.lvl!=1){
                itm=getDataElByLevel(d.path,1);if(itm!=null){tlt+=sep+itm.name+' '+itm.sname;}            
            }
        //}
        m='<div class="select2-result-repository">' +
                    //'<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + tlt + '</div>';
        //if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    }    
    ,getSelectionTemp=function(s){        
        if (!s.id||s=='') {return s.text;}
        //var d=$(s.element).data('meta');
        var d=s; if (!d||typeof d!='object'){return s.text;}        
        s.text=s.name;
        var tlt='',m=''; 
        if(d.lvl==4){tlt=d.name;}else if(d.lvl==6){tlt=d.sname+' '+d.name;}else{tlt=d.name+' '+d.sname;}
        m='<div class="select2-result-repository">' +
                    //'<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + tlt + '</div>';
        //if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';        
        return m;
    }
    ,hideSelection=function(selectedObject){return false;}
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;};
})(jQuery);

/* Home selector */
(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select home...',language:"en"}
        ,dVal:null
        ,modId:''
        ,listSrcUrl:''
        ,listData:[]        
        ,minimumResultsForSearch:0        
        ,allowClear:true
        ,parentControl:null        
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
        //,clearValue:function(){clearFile();}        
    };

    $.fn.bbsHomeLocationSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsHomeLocationSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',pObj=$($this),objId=$($this).attr('id'),dVal=settings.dVal;        
        //html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+(dVal?dVal:'')+'"></select>';
        pObj.attr('name',pObj.attr('id'));
        pObj.attr('class','form-control select2-single');
        //pObj.data('val',(dVal!=null ? dVal : ''));        
        $(pObj).append('<option value=""></option>');
        $(pObj).select2({
            theme:'bootstrap'
            ,language:settings.localzRes.language
            ,ajax:getListData($this)
            //,data:settings.listData
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,minimumInputLength:1
            ,placeholder:settings.localzRes.fldSelectorPlaceholderText
            ,templateResult:getSelectionAndResultTemp
            ,templateSelection:getSelectionAndResultTemp
            ,allowClear:settings.allowClear
        });
        if(settings.parentControl){if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}}

        if(settings.parentControl){$('#'+settings.parentControl).on('change',function(e){
            $(pObj).html('<option value=""></option>').trigger('change');
            if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}else{$(pObj).prop("disabled",false);}
            });
        }

        $(pObj).on('select2:open',function(e){$('#select2-'+objId+'-results').html('');});

        //$(pObj).on('select2:opening',function(e){console.log('select2:opening123');return false;});
        //$('#frmAccountGUID'+settings.modId).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
    }
    ,getListData=function($this){
        var settings=getSettings($this),srcurl=settings.listSrcUrl,apikey='6FF51184-77C9-4C5A-B78A-60ACF76D4460';
        if(!srcurl || !settings.parentControl){return null}        
        var ajx={
             url:srcurl             
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            //,async:false
            ,data:function(p){
                var pId=$('#'+settings.parentControl).val();
                return{
                     skey:p.term
                    ,pg:p.page||1
                    ,apikey:apikey
                    ,pid:pId
                };
            }
            ,processResults:function(data,p){
                p.page=p.page||1;                
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
            //,success:function(data){console.log('success');}
        };
        return ajx;
    }
    //,getDataElByLevel=function(d,l){var rd;$.each(d,function(i,item){if(item.lvl==l){rd=item;return false;}});return rd;}
    ,getSelectionAndResultTemp=function(s){        
        if(!s.id||s==''){return s.text;}
        //var d=$(s.element).data('meta');
        var d=s,m='';
        if (!d||typeof d!='object'){return s.text;}         
        s.text=s.name;
        m='<div class="select2-result-repository">' +
                    //'<div class="select2-result-repository__avatar"><img src="' + d.icnurl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">'+d.hnum+(d.bnum!=''?'/'+d.bnum:'')+(d.snum!=''?'/'+d.snum:'')+'</div>';
        //if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    }
    ,hideSelection=function(selectedObject){return false;}
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;};
})(jQuery);