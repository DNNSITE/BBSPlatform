/*
 * Project: BBS.Full
 * Version: 1.8
 * Author: dnn.site
 * Website: http://dnn.site 
*/

/* General */

//function includeJS(scriptUrl){document.write('<script src="' + scriptUrl + '"></script>');}

function bbs_getNewGuid(){function s4(){return Math.floor((1 + Math.random())*0x10000).toString(16).substring(1);}return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();}

function bbs_getUrlParam(p) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),sURLVariables = sPageURL.split('&'),sParameterName,i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === p) {return sParameterName[1] === undefined ? true : sParameterName[1];}
    }
}

function bbs_getDataFromUrlParam() {
    var d = {},query = window.location.search.substring(1),vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof d[pair[0]] === "undefined") {
            d[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof d[pair[0]] === "string") {
            var arr = [d[pair[0]],decodeURIComponent(pair[1]) ];
            d[pair[0]] = arr;
        } else {
            d[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return d;
}

function bbs_convertUrlParamDataToFormData(d) {fd=[];$.each(d,function(k,v){fd.push($.parseJSON('{"name":"'+k+'","val":"'+v+'"}'));});return fd;}

function bbs_convertDataToUrlParam(d) {var p='',s='';
    if (!d || typeof d != 'object') {return p;}
    $.each(d,function(i,itm){s+=(s!=''?',':'')+'"'+itm.name+'":"'+itm.val+'"';});
    if(s!=''){s='{'+s+'}';p=$.param($.parseJSON(s));}return p;
}

/* listing  */
function bbs_listing_getItemsCheckedSelects(modId){
    var d=[],o1='#dnn_ctr'+modId+'_ModuleContent table tbody .icheck input',o2='#frmCustomFieldListSelects'+modId;
    $(o1).each(function(){if($(this).prop('checked')){d.push({id:$(this).val()});}});$(o2).val(JSON.stringify(d));
}

function bbs_listing_init(modId){
    var o1='#dnn_ctr'+modId+'_ModuleContent table tbody .icheck input',o2='#dnn_ctr'+modId+'_ModuleContent .icheck input';    
    $(o2).iCheck({checkboxClass:'icheckbox_minimal-blue',radioClass:'iradio_minimal-blue'});
    $(o1).on('ifChanged',function(e){if($(e.target).attr('id')=='bbs_listing_chkbx_selall'+modId){if($(e.target).prop('checked')){$(o1).iCheck('check');}else{$(o1).iCheck('uncheck');}}else{bbs_listing_getItemsCheckedSelects(modId);}});
    $.applyDataMask();
    $('[data-toggle="tooltip"]').tooltip();
    window.scrollTo(0,0);
}

function bbs_listing_ref(modId,pg,fd){    
    $('#frmFilterData'+modId).val(JSON.stringify(fd));
    lxFetch(modId,(pg==null?0:pg),'action=loadlisting',null,function(s){if(s=='200'){return true;}else{return false;}});
}

function bbs_getDealerTypesSelectorTemp(s){        
    if (!s.id) {return s.text;}
    var d=$(s.element).data('meta');
    var m='<div class="select2-result-repository">' +                    
                '<div class="select2-result-repository__meta">' +
                '<div class="select2-result-repository__title">' + d.name + '</div>';
    if(d.descr){m+="<div class='select2-result-repository__subtitle'>" + d.descr + "</div>";}
    m+='</div>';
    return m;
}


/* 
* BBS.AccountAgreeSelector 
* Version: 1.2
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
        ,setValue:function(v){this.each(function(e){setValue(this,v);});}  
        //,clearValue:function(){clearFile();}        
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
        pObj.attr('name',pObj.attr('id'));
        pObj.attr('class','form-control select2-single');
        pObj.data('val',(dVal!=null?dVal:''));

        if(settings.listData!=null){
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
            }).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
        }else{
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
            }).on('change.bbsaccagreeselector'+settings.modId,settings.onChange);
        }

        setValue($this,settings.dVal);
        console.log('rrrrrrrrr: '); 
    }
    ,getListData=function($this){
        var settings=getSettings($this),srcurl=settings.listSrcUrl,apikey=settings.listSrcApiKey;
        if(!srcurl||!apikey){return null}
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
                    ,pg:p.page
                    ,apikey:apikey
                    ,kind:settings.filterByKind
                    ,acctps:settings.filterByTypes
                };
            }
            ,processResults:function(data,p){
                p.page=p.page || 1;
                console.log('processResults: ',data);
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
            //,success:function(data){console.log('success');}
        };
        return ajx;
    }
    ,getResultTemp=function(s){
        if(!s.id||s==''){return s.text;}
        var d=s;
        if(!d||typeof d!='object'){return s.text;}         
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
        if (!s.id||s=='') {return s.text;}
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
    ,getValue=function(isRaw){var d=$('#frmAccountGUID'+settings.modId).val();return d;}
    ,setValue=function($this,v){
        if(!v){return;}
        var settings=getSettings($this),pObj=$($this);
        if(settings.listData&&typeof settings.listData=='object'){$($this).val(v).trigger('change.select2');}
    };
})(jQuery);

/* 
* BBS.MoneyInput 
* Version: 1.1
*/
(function($){    
    var defaults={
         localzRes:{placeholderText:'Select item...'}
        ,dVal:null
        ,modId:''
        ,minCurrResultsForSearch:7
        ,enabled:true
        ,readOnly:false
        ,isReq:false
        ,currListData:[]
        ,defCurrId:null        
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
        ,getDataValue:function(){return getDataValue(this);}
        ,setValue:function(v){this.each(function(e){setValue(this,v);});}
        ,setDataValue:function(d){this.each(function(e){setDataValue(this,d);});}
    };
    var getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),paneId=$($this).attr('id'),html='',pObj=$('#'+paneId),dVal=settings.dVal,strArrVal='',dVal_prc='',dVal_cur='';
        if(dVal!=null){strArrVal='['+dVal.replace(/\|/g,',')+']';if($.isArray(eval(strArrVal))){dVal_prc=eval(strArrVal)[0];dVal_cur=eval(strArrVal)[1];}else{strArrVal='';}}
        html+='<div class="form-group money-input">';
        html+='<div class="input input-group'+(settings.enabled==false?' state-disabled':'')+(settings.isReq?' reqInd':'')+'">';        
        html+='<input type="text" id="frmVal_money'+settings.modId+'_price" name="frmVal_money'+settings.modId+'_price"'+(settings.readOnly?' readonly="readonly"':'')+(settings.enabled==false?' disabled="disabled"':'')+(dVal_prc?' value="'+dVal_prc+'"':'')+(settings.placeholderText?' placeholder="' +settings.placeholderText+'"':'')+' maxlength="15" style="border-right:none;"/>';                
        html+='</div>';
        html+='<div class="select2 select2-group">';
        html+='<select id="frmVal_money'+settings.modId+'_curid" name="frmVal_money'+settings.modId+'_curid"'+' class="select2-single">';        
        $.each(settings.currListData,function(i,itm){html+='<option value="'+itm.id+'"'+(dVal_cur==itm.id?' selected="selected"':'')+(itm.hasOwnProperty('icncss')?' data-icn="'+itm.icncss+'"':'')+'>'+itm.title+'</option>';});
        html+='</select>';
        html+='</div>';
        html+='</div>';        
        html+='</label>';        
        pObj.append(html);   
        $('#frmVal_money'+settings.modId+'_price').mask('# ##0',{reverse:true});
        $('#frmVal_money'+settings.modId+'_curid').select2({
            theme:'bootstrap'
            ,hideSelectionFromResult:function(selectedObject){return false;}
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minCurrResultsForSearch
            ,templateResult:getSelTemp
            ,templateSelection:getSelTemp
            ,allowClear:false
        });        
        $('#frmVal_money'+settings.modId+'_curid').on('change.bbsmoneyinput'+settings.modId,function(){
            var v=getValue($this);settings.onChange.call($this,v);
        });        
    }
    ,getSelTemp=function(s){        
        if(!s.id){return s.text;}        
        var icn=$(s.element).data('icn'),v=$(s.element).attr('value'),t=$(s.element).html();         
        var m='<div class="select2-result-repository"><div class="select2-result-repository__cssicn"><i class="'+icn+'"></i></div><div class="select2-result-repository__meta"><div class="select2-result-repository__title"> ('+t+')</div></div></div>';
        return m;
    }
    ,getValue=function($this){
        var settings=getSettings($this);
        console.log('settings: ',settings);
        console.log('$this: ',$this);
        var v='',p=$('#frmVal_money'+settings.modId+'_price').val(),c=$('#frmVal_money'+settings.modId+'_curid').val();
        p=p.replace(/ /g,'');if(isNaN(p)!=false){p='';}if(p!=''&&c!=''){v=p+'|'+c;}return v;
    }
    ,getDataValue=function($this){
        var settings=getSettings($this);
        var v=null,p=$('#frmVal_money'+settings.modId+'_price').val(),c=$('#frmVal_money'+settings.modId+'_curid').val();
        p=p.replace(/ /g,'');if(isNaN(p)!=false){p='';}if(p!=''&&c!=''){v={"cur":c,"val":p};}return v;
    }  
    ,setDataValue=function($this,d){
        var settings=getSettings($this);
        console.log('settings: ',settings)
        if(d==null||typeof d!='object'){return;}if(d.length==0){return;}
        $('#frmVal_money'+settings.modId+'_price').val(d.val);
        $('#frmVal_money'+settings.modId+'_curid').val(d.cur).trigger('change.select2');
    }
    ,setValue=function($this,v){
        var settings=getSettings($this),strArrVal='',c='',p='';
        if(v!=''){strArrVal='['+v.replace(/\|/g,',')+']';if($.isArray(eval(strArrVal))){p=eval(strArrVal)[0];c=eval(strArrVal)[1];}}
        $('#frmVal_money'+settings.modId+'_price').val(p);
        $('#frmVal_money'+settings.modId+'_curid').val(c).trigger('change.select2');
    };
    $.fn.bbsMoneyInput=function(methodOrOptions){
        if(methods[methodOrOptions]){return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));}
        else if(typeof methodOrOptions==='object'||!methodOrOptions){return methods.init.apply(this,arguments);}
        else{$.error('Method '+methodOrOptions+' does not exist on jQuery.bbsMoneyInput');}
    };
})(jQuery);

/*
 * Project: BBS.LocationSelector
 * Version: 1.2
*/
(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select location...'}
        ,dVal:null
        ,modId:''                        
        /*,listSrcUrl:'' */
        ,listData:null /*{extdata:{srcurl:''},localdata:{}}*/        
        ,level:null 
        ,markVisible:true
        ,minimumResultsForSearch:0
        ,minimumInputLength:0
        ,allowClear:true
        ,parentControl:null
        ,fullPathTitleVisible:true
        ,theme:'bootstrap'
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
            theme:settings.theme
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
        }).on("change",function(e){settings.onChange.call(this,e);});

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
        var settings=getSettings($this),listData=settings.listData,srcurl;/*settings.listSrcUrl,apikey='5FF51184-77C9-4C5A-B78A-60ACF76D4459';*/
        if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;}           
        if(!srcurl){return null}        
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
                    ,pg:p.page
                    /*,apikey:apikey*/
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
                p.page=p.page || 1;                
                return{
                     results:data.items
                    ,pagination:{more:(p.page*30)<data.total_count}
                };
            }
            /*,success:function(data){console.log('success');}*/
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
        //console.log('sss1 ',s);
        if (!s.id||s=='') {return s.text;}
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
        //console.log('sss2 ',s);
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

(function ($){
    var defaults={
         localzRes:{fldSelectorPlaceholderText:'Select home...'}
        ,dVal:null
        ,modId:''
        ,listData:null /*{extdata:{srcurl:''},localdata:{}}*/   
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
        }).on("change",function(e){settings.onChange.call(this,e);});

        if(settings.parentControl){if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}}
        if(settings.parentControl){$('#'+settings.parentControl).on('change',function(e){
            $(pObj).html('<option value=""></option>').trigger('change');
            if($('#'+settings.parentControl).val()==''){$(pObj).prop("disabled",true);}else{$(pObj).prop("disabled",false);}
            });
        }
        $(pObj).on('select2:open',function(e){$('#select2-'+objId+'-results').html('');});
        //$(pObj).on('select2:opening',function(e){console.log('select2:opening123');return false;});        
    }
    ,getListData=function($this){
        var settings=getSettings($this),listData=settings.listData,srcurl;
        if(listData!=null&&typeof listData=='object'){srcurl=listData.extdata.srcurl;}   
        if(!srcurl||!settings.parentControl){return null}        
        var ajx={
             url:srcurl             
            ,dataType:'json'
            ,delay:250
            ,cache:false
            ,type:'GET'
            //,async:false
            ,data:function(p){                
                if(settings.parentControl){pId=$('#'+settings.parentControl).val();}                
                return{
                     skey:p.term
                    ,pg:p.page                    
                    ,pid:pId
                    ,lvl:'100'
                };
            }
            ,processResults:function(data,p){
                p.page=p.page || 1;
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
        if (!s.id||s=='') {return s.text;}
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

/* 
* xEditMDFolderSelect 
* Version: 1.1
*/
(function ($){
    var defaults={
         localzRes:{
            selectorPlaceholderText:'Select folder...'
            ,emptyText:'Without folder'
         }
        ,dVal:null
        ,modId:''
        ,listData:null
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
        ,setValue:function(v){this.each(function(e){setValue(this,v);});}        
    };

    $.fn.xEditMDFolderSelect=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.xEditMDFolderSelect');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',wdgt=$($this),wdgtId=$($this).attr('id'),dVal=settings.dVal,html='',srsUrl=null,listData=settings.listData;         
        if(listData!=null&&typeof listData=='object'){srsUrl=listData.extdata.srcurl;}
        //if(settings.listSrcUrl!=null&&settings.listSrcUrl!=''){srsUrl=settings.listSrcUrl+(settings.schGuid!=null?'&schid='+settings.schGuid:'')+(settings.listSrcApiKey!=null?'&apikey='+settings.listSrcApiKey:'')+(settings.ownrAccGuid!=null?'&ownraccguid='+settings.ownrAccGuid:'');}
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
            ,error:function(res,nVal){                
                settings.onChange.call(this,null);
                return{nVal:nVal};
            }
            ,success:function(res,nVal){                
                settings.onChange.call(this,nVal);
                return{nVal:nVal};
            }
            ,display:function(v){
                if(v!=null&&typeof v=='object'){$(this).text(v.pathtitle);$('#'+wdgtId+'_btnClear').show();}
                else{$(this).text(settings.localzRes.emptyText);$('#'+wdgtId+'_btnClear').hide();}
            }
            ,jstree:{
                 srsurl:srsUrl
            }
        });
        setValue($this,settings.dVal);        
        $('#'+wdgtId+'_btnClear').on('click',function(e){$('#'+wdgtId+'_editable').editable('setValue',null);settings.onChange.call(this,null);});
    }
    ,getValue=function($this){
        return $('#'+$($this).attr('id')+'_editable').editable('getValue',true);
    }
    ,setValue=function($this,v){
        var wdgtId=$($this).attr('id');
        if(v!=null&&typeof v=='object'){if(v.length==0){v='';}else{if(v.id==''){v='';}}}else{v='';}
        if(v!=''){v.pathtitle=v.pathtitle.replace(/\{0\}/g,' > ');}        
        $('#'+wdgtId+'_editable').editable('setValue',v);
        if(v==''){$('#'+wdgtId+'_btnClear').hide();}else{$('#'+wdgtId+'_btnClear').show();}
    };    
})(jQuery);

/* 
* xEditLocationSelect
* Version: 1.0
*/
(function ($){
    var defaults={
         localzRes:{selectorPlaceholderText:'Select location...',emptyText:'Without location'}
        ,dVal:null
        ,modId:''
        ,listData:null
        ,listSrcUrl:''
        ,listSrcApiKey:''
        ,level:null
        /*,schGuid:null        
        ,ownrAccGuid:null*/
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
        ,setValue:function(v){this.each(function(e){setValue(this,v);});}        
    };

    $.fn.xEditLocationSelect=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.xEditLocationSelect');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',wdgt=$($this),wdgtId=$($this).attr('id'),dVal=settings.dVal,html='';        
        html+='<a href="#" id="'+wdgtId+'_editable" data-name="'+wdgtId+'_editable" data-emptytext="'+settings.localzRes.emptyText+'" data-source="" class="editable-click" title="'+settings.localzRes.selectorPlaceholderText+'">'+settings.localzRes.selectorPlaceholderText+'</a>';
        if(settings.disabled==false){html+='<button type="button" id="'+wdgtId+'_btnClear" class="btn btn-editable-clear btn-xs" style="display:none"><i class="fa fa-trash"></i></button>';}
        $($this).append(html);        
        $('#'+wdgtId+'_editable').editable({
             pk:1 
            ,type:'geoLocation'
            ,placement:"bottom"
            ,savenochange:true
            ,showbuttons:'bottom'
            ,mode:'popup'
            ,onblur:'ignore'
            ,disabled:settings.disabled
            ,editableform:{buttons:'<button type="submit" class="btn btn-primary btn-sm editable-submit"><i class="fa fa-fw fa-check"></i>1</button><button type="button" class="btn btn-default btn-sm editable-cancel"><i class="fa fa-fw fa-times"></i>2</button>'}
            ,error:function(res,nVal){
                settings.onChange.call(this,null);
                return{nVal:nVal};
            }
            ,success:function(res,nVal){                
                settings.onChange.call(this,nVal);
                return{nVal:nVal};
            }
            ,display:function(v){
                if(v!=null&&typeof v=='object'){$(this).text(v.title);$('#'+wdgtId+'_btnClear').show();}
                else{$(this).text(settings.localzRes.emptyText);$('#'+wdgtId+'_btnClear').hide();}
            }
            ,geoLocation:{
                 listData:settings.listData
                 ,level:settings.level
            }
        });
        setValue($this,settings.dVal);        
        $('#'+wdgtId+'_btnClear').on('click',function(e){$('#'+wdgtId+'_editable').editable('setValue',null);settings.onChange.call(this,null);});
    }
    ,getValue=function($this){
        return $('#'+$($this).attr('id')+'_editable').editable('getValue',true);
    }
    ,setValue=function($this,v){
        var wdgtId=$($this).attr('id');
        if(v!=null&&typeof v=='object'){if(v.length==0){v='';}else{if(v.id==''){v='';}}}else{v='';}
        if(v!=''){v.title=v.title.replace(/\{0\}/g,' > ');}        
        $('#'+wdgtId+'_editable').editable('setValue',v);
        if(v==''){$('#'+wdgtId+'_btnClear').hide();}else{$('#'+wdgtId+'_btnClear').show();}
    };    
})(jQuery);

/* 
* BBS.WFStatusSelector
* Version: 1.0
*/
(function ($){
    var defaults={     
        modId:''
        ,listData:null        
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
    };
    $.fn.bbsWFStatusSelector=function(methodOrOptions){
        if(methods[methodOrOptions]){
            return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof methodOrOptions==='object'||!methodOrOptions){
            return methods.init.apply(this,arguments);
        }else{
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsWFStatusSelector');
        }
    }
    var 
     getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),html='',wdgt=$($this),wdgtId=$($this).attr('id'),d=settings.listData,dVal=$($this).data('val'),html='',drpdwn='',mBtn;
        if(d&&dVal){
            $(wdgt).addClass('btn-group');            
            $.each(settings.listData.list,function(i,itm){            
                if(mBtn==null){mBtn=itm;}else if(itm.val==dVal){mBtn=itm;}            
                if($.inArray(dVal,itm.rule)>-1){drpdwn+='<li><a data-val="'+itm.val+'" href="#">'+(itm.icncss?'<i class="'+itm.icncss+'" aria-hidden="true"></i> ':'')+itm.title+'</a></li>';}
            });
            html='<button class="btn btn-'+(mBtn.style?mBtn.style:'primary')+(drpdwn?' dropdown-toggle':'')+' btn-labeled fa '+mBtn.icncss+'"'+(drpdwn?' data-toggle="dropdown"':'')+' type="button"'+(!drpdwn?' disabled="disabled"':'')+'> '+mBtn.title+(drpdwn?' <i class="dropdown-caret"></i>':'')+'</button>';
            if(drpdwn){html+='<ul class="dropdown-menu dropdown-menu-right">'+drpdwn+'</ul>'};
            $($this).append(html);
            $('#'+wdgtId+' ul li a').on('click',function(){settings.onChange.call(this,$(this).data('val'));});
        }
    };
})(jQuery);