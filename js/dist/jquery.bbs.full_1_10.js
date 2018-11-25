/*
 * Project: BBS.Full
 * Version: 1.10
 * Author: dnn.site
 * Website: http://dnn.site 
*/

/* General */

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
                //console.log('processResults: ',data);
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
 * Project: BBS.AccountSelector
 * Version: 1.1
*/
(function ($) {
    var defaults = {
        localzRes: {                        
             anonymousPersonFldDisplayNameTitle:'Display Name'
            ,anonymousPersonFldEmailTitle:'Email'
            ,anonymousPersonFldPhoneTitle:'Phone'
            ,organizationTabText:'Organization'
            ,organizationFldSelectorTitle:'Organization'
            ,organizationFldContactSelectorTitle:'Contacts'            
            ,organizationFldSelectorPlaceholderText:'Select organization...'
            ,organizationFldContactSelectorPlaceholderText:'Select contacts...'
            ,personTabTitle:'Person'
            ,personFldSelectorPlaceholderText:'Select contacts...'
            ,personFldSelectorTitle:'User'
            ,accountFldSelectorTitle:'Account'
            ,defVal:null
        }
            ,modId:''                        
            ,listSrcUrl:''
            ,organizationAccListSrcName:''
            ,personAccListSrcName:''
            ,personListSrcName:''
            ,mixListSrcName:''
            ,filterListByTypeAcc:null
            ,filterListByUserPermission:null                        
            ,viewMode:'light'
            ,organizationSelectEnable:true
            ,personSelectEnable:true
            ,anonymousPersonSelectEnable:false
            ,defaultActive:'person'
            ,minimumResultsForSearch:10                    
		,onChange:function(){}
    },settings,
    methods={
        init:function(options){
            settings=$.extend({},defaults,options);
            return this.each(function(){
                paneId=$(this).attr('id');
                if(settings.viewMode=='full'){initWidget_fullMode();}else{initWidget_lightMode();}
            });
        }
        ,getValue:function(isRaw){return getValue(isRaw);}
        ,clearValue:function(){clearFile();}
    };
    $.fn.bbsAccountSelector = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsAccountSelector');
        }
    }
    var paneId
    ,initWidget_lightMode=function(){
        var html='',pObj=$('#'+paneId),defVal=settings.defVal,defVal_accGuid='';
        //html+='<section>';
        //html+='<label class="label">'+settings.localzRes.accountFldSelectorTitle+'</label>';
        //html+='<label class="select select2-single-autoheight">';
        html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
        //html+='</label>';
        //html+='</section>';
        pObj.replaceWith(html);
        /*$('#frmAccountGUID'+settings.modId).select2({
            theme:'bootstrap'
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,placeholder:settings.localzRes.accountFldSelectorPlaceholderText
            ,templateResult:getMixResultTemp
            ,templateSelection:getMixSelectionTemp 
        });*/

        loadAccountList();
        $('#frmAccountGUID'+settings.modId).on('change',function(){
            /*var c=settings.dealerInfoBoxTemlate,d=$(this).find(':selected').data('meta'),did;
            if (d!=null&&typeof d=='object'){did=d.id;}
            $(this).data('val',$(this).val());*/
            settings.onChange.call(this);           

        });
    }    
    ,initWidget_fullMode=function(){
        var html='',pObj=$('#'+paneId),tabActive=settings.defaultActive,defVal=settings.defVal,defVal_accGuid='',defVal_contactUsers='',defVal_anmsPersonDisplayName='',defVal_anmsPersonEmail='',defVal_anmsPersonPhone='';
        if(defVal!=null&&typeof defVal=='object'){
            if(defVal.type=='organization'){
                defVal_accGuid=defVal.accid;
                defVal_contactUsers=JSON.stringify(defVal.contacts);
            }else if(defVal.type=='user'){
                defVal_accGuid=defVal.accid;
            }else if(defVal.type=='anonymous'){
                defVal_anmsPersonDisplayName=defVal.anonymousMeta.displayname;
                defVal_anmsPersonEmail=defVal.anonymousMeta.email;
                defVal_anmsPersonPhone=defVal.anonymousMeta.phone;
            }
        }
        if(tabActive=='organization'&&(settings.organizationSelectEnable==false||settings.anonymousPersonSelectEnable==true)){tabActive='person';}
        if(tabActive=='person'&&settings.personSelectEnable==false&&settings.anonymousPersonSelectEnable==false){tabActive='organization';}
        if(settings.organizationSelectEnable==true||settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){
            html+='<div id="navAccountPane'+settings.modId+'" class="tab-container tab-default bbs-accountselector">';
            html+='<ul id="navAccountTabPane'+settings.modId+'" class="nav nav-tabs">';
            html+='<li class="dropdown pull-right tabdrop hide"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-angle-down"></i></a><ul class="dropdown-menu"></ul></li>';
            if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){html+='<li'+(tabActive=='organization'?' class="active"':'')+'><a href="#navAccountDealerTab'+settings.modId+'" data-toggle="tab"><i class="fa fa-building"></i> '+settings.localzRes.organizationTabText+'</a></li>';}
            if(settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){html+='<li'+(tabActive=='person'?' class="active"':'')+'><a href="#navAccountUserTab'+settings.modId+'" data-toggle="tab"><i class="fa fa-user"></i> '+settings.localzRes.personTabTitle+'</a></li>';}                        
            html+='</ul>';
            html+='<div class="tab-content">';
            if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){                
                html+='<div class="sky-form tab-pane'+(tabActive=='organization'?' active':'')+'" id="navAccountDealerTab'+settings.modId+'">';                        
                html+='<fieldset>';                
                html+='<div class="row">';
                html+='<div class="col-md-6">';
                html+='<section>';
                html+='<label class="label">'+settings.localzRes.organizationFldSelectorTitle+'</label>';
                html+='<label class="select select2-single-autoheight">';
                html+='<select id="frmDealerAccountGUID'+settings.modId+'" name="frmDealerAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
                html+='</label>';
                html+='</section>';
                html+='</div>';
                html+='<div class="col-md-6">';
                html+='<section>';
                html+='<label class="label">'+settings.localzRes.organizationFldContactSelectorTitle+'</label>';
                html+='<label class="select">';
                html+='<select id="frmDealerContactUsers'+settings.modId+'" name="frmDealerContactUsers'+settings.modId+'" class="form-control select2-multiple" multiple disabled="disabled" data-val=\''+defVal_contactUsers+'\'></select>';
                html+='</label>';
                html+='</section>'
                html+='</div>';
                html+='</div>';                
                /*<div class=\"alert alert-info\"><i class=\"fa fa-info\"></i>&nbsp; <strong>Информация!</strong> Нет дилера, от имени которого Вы можете публиковать объявления.<br /><br /><a href=\"/my-office/dealers/UserId/[UserId,System]\" class=\"btn btn-info\" style=\"color:#fff!important;\">Зарегистрировать нового дилера</a></div>*/        
                html+='</fieldset>';
                html+='</div>';                
            }
            if(settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){            
                html+='<div class="sky-form tab-pane'+(tabActive=='person'?' active':'')+'" id="navAccountUserTab'+settings.modId+'">';
                html+='<fieldset>';                
                html+='<div class="row">';
                if(settings.anonymousPersonSelectEnable==false){                    
                    html+='<div class="col-md-6">';
                    html+='<section>'        
                    html+='<label class="label">'+settings.localzRes.personFldSelectorTitle+'</label>';
                    html+='<label class="select select2-single-autoheight">';
                    html+='<select id="frmUserAccountGUID'+settings.modId+'" name="frmUserAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
                    html+='</label>';
                    html+='</section>';
                    html+='</div>';
                    html+='<div class="col-md-6">';
                    html+='</div>';                    
                }else{                    
                    html+='<div class="col-md-6">';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldDisplayNameTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmDisplayName'+settings.modId+'" id="frmDisplayName'+settings.modId+'" type="text" maxlength="80"'+(defVal_anmsPersonDisplayName!=''?' value="'+defVal_anmsPersonDisplayName+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldEmailTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmEmail'+settings.modId+'" id="frmEmail'+settings.modId+'" type="text" maxlength="120" '+(defVal_anmsPersonEmail!=''?' value="'+defVal_anmsPersonEmail+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldPhoneTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmPhone'+settings.modId+'" id="frmPhone'+settings.modId+'" type="text" maxlength="20"'+(defVal_anmsPersonPhone!=''?' value="'+defVal_anmsPersonPhone+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='</div>';
                    html+='<div class="col-md-6">';
                    html+='</div>';
                }
                html+='</div>';
                html+='</fieldset>';                                                
                html+='</div>';                
            }
            html+='</div>';
        }
        pObj.replaceWith(html);
        
        if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){
            $('#frmDealerAccountGUID'+settings.modId).select2({
                theme:'bootstrap'
                ,hideSelectionFromResult:hideSelection
                ,escapeMarkup:function(text){return text;}
                ,minimumResultsForSearch:settings.minimumResultsForSearch
                ,placeholder:settings.localzRes.organizationFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp 
            });        
            $('#frmDealerContactUsers'+settings.modId).select2({
                theme:'bootstrap'
                ,allowClear:false
                ,hideSelectionFromResult:hideSelection
                ,escapeMarkup:function(text){return text;}                
                ,placeholder:settings.localzRes.personFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp   
            });
            loadAccountList();
            $('#frmDealerAccountGUID'+settings.modId).on('change',function(){
                var c=settings.dealerInfoBoxTemlate,d=$(this).find(':selected').data('meta'),did;
                if (d!=null&&typeof d=='object'){did=d.id;}
                $(this).data('val',$(this).val());
                $('#frmDealerContactUsers'+settings.modId).data('val','');
                $('#frmDealerContactUsers'+settings.modId).val('').trigger('change');           
                loadOrganizationUserList(did);           
            });
            $('#frmDealerContactUsers'+settings.modId).on('change',function(){           
                $(this).data('val',$(this).val());                      
            });                                            
        }
        if(settings.personSelectEnable==true&&settings.anonymousPersonSelectEnable==false){
            $('#frmUserAccountGUID'+settings.modId).select2({
                theme:'bootstrap'            
                ,escapeMarkup:function(text){return text;}
                ,minimumResultsForSearch:settings.minimumResultsForSearch
                ,placeholder:settings.localzRes.personFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp 
            });        
            loadFriendList();
        }
    },
    loadAccountList=function(m){
        var o='',f='',dVal='',isSel=false,srcname='';
        if(m=='organization'){o='#frmDealerAccountGUID'+settings.modId;srcname=settings.organizationAccListSrcName;}
        else if(m=='person'){o='#frmUserAccountGUID'+settings.modId;srcname=settings.personAccListSrcName;}
        else {o='#frmAccountGUID'+settings.modId;srcname=settings.mixListSrcName;}
        f={"srcname":srcname,"dlrtp":settings.filterListByTypeAcc};dVal=$(o).data('val');        
        $(o).html('');$(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    if(item.id==dVal&&isSel==false){isSel=true;}                    
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        }); 
        if(settings.viewMode=='full' && isSel==true){loadOrganizationUserList(dVal);}       
    },
    /*loadOrganizationList=function(){        
        var o='#frmDealerAccountGUID'+settings.modId;$(o).html(''),f={"srcname":"D854896F-B5C2-4A9C-93E4-4E149D72AE8F"},dVal=$(o).data('val'),isSel=false;
        $(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    if(item.id==dVal&&isSel==false){isSel=true;}
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(item.id==dVal?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        });
        if(isSel=true){loadOrganizationUserList(dVal);}
    },*/
    loadOrganizationUserList=function(accid){        
        var o='#frmDealerContactUsers'+settings.modId;$(o).html(''),f={"srcname":settings.personListSrcName,"accid":accid,"usrprmsn":settings.filterListByUserPermission},dVal=$(o).data('val'),isSel=false;
        if(!accid||accid==''){$(o).prop("disabled",true);return;}
        $(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    isSel=false;
                    if(dVal!=null){
                        $.each(dVal,function(i,v){
                            if(item.id==v){isSel=true;return false;}
                        });
                    }
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        });
    },
    /*loadFriendList=function(){        
        var o='#frmUserAccountGUID'+settings.modId;$(o).html(''),f={"srcname":"getfriendlistbyuser"},dVal=$(o).data('val'),isSel=false;                
        var data=[{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a446","title":"Иванов Иван Иванович","logourl":"assets/img/1.png","subtitle":"Директор"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a447","title":"Петров Виталий Федорович","logourl":"assets/img/2.png","subtitle":"Бухгалтер"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a448","title":"Сидоров Степан Петрович","logourl":"assets/img/3.png","subtitle":"Завхоз"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a449","title":"Ладыженский Евгений Николаевич","logourl":"assets/img/4.png","subtitle":"Заместитель бухгалтера"}];
        $(o).prop("disabled",false);        
        $(o).append('<option value="">&nbsp;</option>');
        $.map(data,function(item){
            if(item.id==dVal&&isSel==false){isSel=true;}
            $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(item.id==dVal?' selected="selected"':'')+'>'+item.title+'</option>');
        });
    },*/    
    getMixResultTemp=function(s){        
        if (!s.id) {return s.text;}        
        var d=$(s.element).data('meta');
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    },
    getMixSelectionTemp=function(s){        
        var d=$(s.element).data('meta');
        if (!d || typeof d!='object'){return s.text;} 
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';        
        return m;
    },
    hideSelection=function(selectedObject){return false;},
    getValue=function(isRaw){
        var d,tp='',accGuid='',contactUsers='',anmsPersonDisplayName='',anmsPersonEmail='',anmsPersonPhone='';
        if($('ul#navAccountTabPane'+settings.modId+' li.active a').attr('href')=='#navAccountDealerTab'+settings.modId){            
            tp='organization';
            accGuid=$('#frmDealerAccountGUID'+settings.modId).data('val');
            contactUsers=JSON.stringify($('#frmDealerContactUsers'+settings.modId).data('val'));
            if(accGuid==null){accGuid=''}
            if(contactUsers==null){contactUsers=''}
            d={"type":tp,"accid":accGuid,"contacts":contactUsers};
        } 
        else {
            if(settings.anonymousPersonSelectEnable==true){
                tp='anonymous';
                anmsPersonDisplayName=$('#frmDisplayName'+settings.modId).val();
                anmsPersonEmail=$('#frmEmail'+settings.modId).val();
                anmsPersonPhone=$('#frmPhone'+settings.modId).val();
                d={"type":tp,"anonymousMeta":{"displayname":anmsPersonDisplayName,"email":anmsPersonEmail,"phone":anmsPersonPhone}};
            }else{
                tp='user';
                accGuid=$('#frmUserAccountGUID'+settings.modId).val();
                d={"type":tp,"accid":accGuid};
            }
        }
        return d
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
 * Version: 1.4
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

/*
 * Project: BBS.MDEditor
 * Version: 1.0
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
        if(settings.disabled==false){html+='<button type="button" id="'+wdgtId+'_btnAddMDItem" class="btn btn-primary btn-xs"><i class="fa fa-plus"></i> '+settings.localzRes.btnAddMDItemTitle+'</button>';}
        html+='</div>';
        html+='</div>';
        $($this).append(html);
        if(settings.disabled==false){$('#'+wdgtId+'_btnAddMDItem').on('click',function(){addMDItem($this);});}
        for(var i=1;i<=settings.minItems;i++){addMDItem($this);}
    }
    ,addMDItem=function($this){
        var settings=getSettings($this),wdgtId=$($this).attr('id'),html='',l=0,itmObjId='';        
        l=$('#'+wdgtId+'_mdeditorpane').data('totalitems');if(l==null){l=0;}l+=1;
        itmObjId=wdgtId+'_mditem'+l;if(settings.maxItems>0&&settings.maxItems<l){return;}        
        html+='<div id="'+itmObjId+'">';
        if(l>1){html+=settings.separator;}
        html+='<div class="sky-form">';
        if(settings.disabled==false&&settings.minItems<l){html+='<div class="clearfix"><button type="button" data-action="'+wdgtId+'_delmditem" data-itmid="'+l+'" class="btn btn-sm pull-right"><i class="fa fa-trash"></i></button></div>';}
        html+=settings.HTMLTemplate.replace(/\{0\}/g,settings.modId+l); +'</div></div>'; 
        $('#'+wdgtId+'_mdeditorpane').append(html);
        $('#'+wdgtId+'_mdeditorpane').data('totalitems',l);
        if(settings.disabled==false){$('button[data-action="'+wdgtId+'_delmditem"]').on('click',function(){delMDItem($this,$(this).data('itmid'));});}
        $('#'+itmObjId).fastForm({
            localzRes:settings.localzRes.mdLocalzRes 
            ,formId:'#Form'
            ,modId:settings.modId+l
            ,currencyData:settings.currencyData
            ,currencyId:settings.currencyId
            ,formData:settings.formData
            ,listData:settings.listData
        });
    }
    ,delMDItem=function($this,id){        
        var settings=getSettings($this),wdgtId=$($this).attr('id');        
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

/*
* Project: bbsDropUpload
* Version: 1.1
*/
(function ($) {
    var defaults = {
        localzRes: {
            cancelUploadText: null
            , responseErrorText: null
            , fallbackMessageText: null
            , defaultMessageText: null
            , statusOkText: null
            , statusErrorText: null
            , placeholderDescriptText: null
        }
            , modid: ''
            , existsFileData: []
            , existsFileFolderUrl: ''
            , gateUrl: ''
            , thmbnlWidth: 160
            , thmbnlHeight: 105
            , maxFilesize: 6
            , maxFiles: 10
            , acceptedFiles: 'image/*'
		, onChange: function () { }
        , onMaxFilesExceeded: function () { }
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                paneId = $(this).attr('id');
                initWidget();
            });
        }
        , getFileData: function () { return getFileData(); }
        , removeAllFiles: function () { removeAllFiles(); }
    };

    $.fn.bbsDropUpload = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bbsDropUpload');
        }
    }

    var paneId, dropzoneObj, totExtFls = 0, initWidget = function () {
        var html = '', pObj = $('#' + paneId);
        html += '<div id="dropzonePane' + settings.modid + '" class="dropzone" data-files=\'[]\'></div>';
        pObj.replaceWith(html);
        Dropzone.autoDiscover = false;
        dropzoneObj = new Dropzone('#dropzonePane' + settings.modid, {
            url: settings.gateUrl
            , thumbnailWidth: settings.thmbnlWidth
            , thumbnailHeight: settings.thmbnlHeight
            , maxFilesize: settings.maxFilesize
            , maxFiles: settings.maxFiles
            , addRemoveLinks: true
            , acceptedFiles: settings.acceptedFiles
            , dictRemoveFile: ' X '
            , dictCancelUpload: settings.localzRes.cancelUploadText
            , dictResponseError: settings.localzRes.responseErrorText
            , dictFallbackMessage: settings.localzRes.fallbackMessageText
            , dictDefaultMessage: settings.localzRes.defaultMessageText
            , previewTemplate: '<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-image\"><img data-dz-thumbnail /></div>\n<div class=\"dz-details\"><textarea class=\"dz-descedt\" draggable=\"false\" maxlength=\"512\" disabled=\"disabled\"></textarea></div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>'
            , init: function () {
                var fd = settings.existsFileData, fdz, $this = this, flnm = '', fldr = '', prevElId = '', newItmData;
                if (!fd || typeof fd != 'object') { return; } if (fd.length == 0) { return; }
                $.each(fd, function (i, itm) {
                    flnm = itm.filename + '-sm' + itm.ext;
                    fdz = { "name": flnm, "type": "image/jpeg", "status": "success", "size": 0, "accepted": true, "processing": true };
                    prevElId = 'prevEl_' + itm.filename;
                    newItmData = { "filename": itm.filename, "ext": itm.ext, "desc": itm.desc, "emode": "update" };
                    $this.emit("addedfile", fdz);
                    $this.emit("thumbnail", fdz, settings.existsFileFolderUrl + '/' + flnm);
                    $this.emit("complete", fdz);
                    $this.files.push(fdz);
                    fdz.previewElement.setAttribute("id", prevElId);
                    $(fdz.previewElement).attr('id', prevElId).data('file', newItmData);
                    $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText).val(itm.desc);
                });
                totExtFls = fd.length;
            }
            , success: function (file, response) {
                var d = $.parseJSON(response);
                if (!d) { file.previewElement.classList.add("dz-error"); return false; }
                var prevElId = 'prevEl_' + d.filename;
                file.previewElement.classList.add("dz-success");
                file.previewElement.setAttribute("id", prevElId);
                $(file.previewElement).attr('id', prevElId).data('file', d);
                $('#' + prevElId + ' textarea.dz-descedt').removeAttr('disabled').attr('placeholder', settings.localzRes.placeholderDescriptText);
            }
            , error: function (file, response) {
                file.previewElement.classList.add("dz-error");
                $(file.previewElement).find('.dz-error-message span').html(settings.localzRes.statusErrorText);
            }
            , maxfilesexceeded: function (file) {
                this.removeFile(file);
                settings.onMaxFilesExceeded.call(this);
            }
        });
    },
    removeAllFiles = function () {
        dropzoneObj.removeAllFiles();
    },
    getFileData = function () {
        var resd=[], fd = [], efd = settings.existsFileData, isExt = 0;
        $('#dropzonePane' + settings.modid + ' .dz-preview').each(function () {
            var fd_itm = $(this).data('file'), desc = '';
            if (!fd_itm || typeof fd_itm != 'object') { return true; }
            desc = $(this).find('textarea.dz-descedt').val(); if (desc) { fd_itm.desc = desc; }
            fd.push(fd_itm);
        });
	resd=fd;
        $.each(efd, function (i1, itm1) {
            isExt = 0;
            $.each(fd, function (i2, itm2) { if (itm1.filename == itm2.filename) { isExt = 1; return false; } });
            if (isExt == 0) { resd.push({"filename":itm1.filename,"ext":itm1.ext,"desc":itm1.desc,"emode":"del"});}
        });
        return resd;
    };
})(jQuery);


/*
 * Project: bbsGallery
 * Version: 1.0
*/
(function ($) {
    var defaults = {
          modid: ''
        , galleryData: []
        , adsId: ''
        , galleryPath: ''
        , noPhotoFullPath: ''
        , autoScaleSliderWidth:960
        , autoScaleSliderHeight:720
    }, settings,
    methods = {
        init: function (options) {
            settings = $.extend({}, defaults, options);
            return this.each(function () {
                paneId = $(this).attr('id');
                initGallegy();
            });
        }
    };

    $.fn.bbsGallery = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bbsGallery');
        }
    }
    var paneId, initGallegy = function () {
        var html = '', d = settings.galleryData, pObj = $('#' + paneId), galleryFullPath = settings.galleryPath + settings.adsId + '/img/', isDataExst=true;
        if (!d || typeof d != 'object') { isDataExst = false; } else if (d.length == 0) { isDataExst = false; }
        if (isDataExst) {
            $.each(d, function (i, itm) {
                html += ' <a class="rsImg"   data-rsBigImg="' + galleryFullPath + itm.filename + '-lg' + itm.ext + '" href="' + galleryFullPath + itm.filename + itm.ext + '.ashx?w='+settings.autoScaleSliderWidth+'&h='+settings.autoScaleSliderHeight+'&scale=both">' + (itm.desc==''?'':'<span>'+itm.desc+'</span>') + '<img width="96" height="72" class="rsTmb" src="' + galleryFullPath + itm.filename + '-sm' + itm.ext + '" /></a>';
            });

            pObj.addClass('royalSlider rsDefault rsDNNAds').html(html);
            //console.log('settings.autoScaleSliderWidth: ',settings.autoScaleSliderWidth);
            $(pObj).royalSlider({
                fullscreen: {
                    enabled: true,
                    nativeFS: true
                },
                controlNavigation: 'thumbnails',
                autoScaleSlider:true,
                autoScaleSliderWidth: 960, //settings.autoScaleSliderWidth,
                autoScaleSliderHeight:725, // settings.autoScaleSliderHeight,
                loop: true,
                imageScaleMode: 'fit-if-smaller',
                navigateByClick: true,
                numImagesToPreload: 2,
                arrowsNav: true,
                arrowsNavAutoHide: true,
                arrowsNavHideOnTouch: true,
                keyboardNavEnabled: true,
                fadeinLoadedSlide: true,
                globalCaption: true,
                globalCaptionInside: false,
                transitionType:'fade',
		transitionSpeed:300,
                thumbs: {
                    appendSpan: true,
                    firstMargin: true,
                    paddingBottom: 4
                }
            });
        } else { html = '<img src="' + settings.noPhotoFullPath + '" class="img-thumbnail img-responsive" />'; pObj.replaceWith(html); }
}
})(jQuery);