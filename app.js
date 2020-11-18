var budgetcontroller=(function()
{
   var Expense=function(id,description,value)
   {
      this.id=id;
      this.description=description;
      this.value=value;
      this.percentage=-1;
   };
   Expense.prototype.calpercentage=function(totalinc){
      if(totalinc>0)
      this.percentage=Math.round((this.value/totalinc)*100);
      else this.percentage=-1;
   };
   Expense.prototype.getpercentage=function()
   {
     return this.percentage;
   };
   var Income=function(id,description,value)
   {
     this.id=id;
     this.description=description;
     this.value=value;
   };
   var data={
      items:
      {
         exp:[],
         inc:[]
      },
      total:
      {
         exp:0,
         inc:0 
      },
      percentage:0,
   };
   return {
      insert:function(type,description,value){
         var newItem;
         var Id;
         if(data.items[type].length>0)
         Id=data.items[type][data.items[type].length-1].id+1;
         else 
         Id=0;
         if(type=='inc')
         newItem=new Income(Id,description,value);
         else
         newItem=new Expense(Id,description,value);
         data.items[type].push(newItem);
         return newItem;
      },
      calculatebudget:function()
      {
         var sum=0;
         var sum2=0;
         data.items['exp'].forEach(function(cur)
         {
            sum+=cur.value;
         });
         data.items['inc'].forEach(function(cur)
         {
            sum2+=cur.value;
         });
         data.total['exp']=sum;
         data.total['inc']=sum2;
         data.percentage=Math.round(sum/sum2*100);
      },
      getbudeget:function()
      {
         return{
          balance:data.total['inc']-data.total['exp'],
          t1:data.total['inc'],
          t2:data.total['exp'],
          profit:data.percentage
         };
      },
      calculatePercentage:function()
      {
        data.items.exp.forEach(function(cur)
        {
           cur.calpercentage(data.total.inc);
        });
      },
      getPercentage:function()
      {
         var par;
          par=data.items.exp.map(function(cur){
            return cur.getpercentage();
         });
         return par;
      },
      delete:function(type,id)
      {
         var arr;
         var x;
         var index;
         if(type=="income")
         x='inc';
         else 
         x='exp';
         arr=data.items[x].map(function(current){ 
              return current.id;
         });
         index=arr.indexOf(id);
         if(index!=-1)
         {
            data.items[x].splice(index,1);
         }
      }

   };

})();
var UIcontrol=(function()
{
   return {
      input:function()
      {
      return{
         type:document.querySelector('.add__type').value,
         string:document.querySelector('.add__description').value,
         value:parseFloat(document.querySelector('.add__value').value)
      };
   },
   addItem:function(obj,type){
      var html,change,element;
      if(type=='inc')
      {
     html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
     element='.income__list';
      } 
    else 
    {
       element='.expenses__list';
   html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }
    change=html.replace('%id%',obj.id);
   change=change.replace('%description%',obj.description);
   change=change.replace('%value%',obj.value);
   document.querySelector(element).insertAdjacentHTML('beforeend',change);
   },
   deletehtml:function(ID)
   {
      var el=document.getElementById(ID);
      el.parentNode.removeChild(el);
   },
   clearfields:function()
   {
      var arr=document.querySelectorAll('.add__description'+ ','+'.add__value');
      var field=Array.prototype.slice.call(arr);
      field.forEach(function(current,i,array){
         current.value=""; 
      });
      field[0].focus();
   },
   displaypercentage:function(per)
   {
      var x=document.querySelectorAll('.item__percentage');
      var nodeforeach=function(y,callback)
      {
         for(var i=0;i<y.length;i++)
         {
            callback(y[i],i);
         }
      };
      nodeforeach(x,function(current,index)
      {
         if(per[index]>0)
         current.textContent=per[index]+'%';
         else
         current.textContent='---';
      });
   },
   displaymonth:function()
   {
      var d=new Date();
      var m=d.getMonth();
      var y=d.getUTCFullYear();
      var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
      document.querySelector('.budget__title--month').textContent=months[m]+' '+y;

   },
   displaybudget:function(obj){
      document.querySelector('.budget__value').textContent=obj.balance;
      document.querySelector('.budget__income--value').textContent=obj.t1;
      document.querySelector('.budget__expenses--value').textContent=obj.t2;
      if(obj.profit >= 0)
      document.querySelector('.budget__expenses--percentage').textContent=obj.profit +'%';
      else
      document.querySelector('.budget__expenses--percentage').textContent='--';

   }
   };

})();

var controller=(function(budget,ui)
{
   var main=function()
   {
   var check=ui.input();
   if(check.description!="" && !isNaN(check.value) && check.value>0){
   var inp=budget.insert(check.type,check.string,check.value);
   ui.addItem(inp,check.type);
   ui.clearfields();
  /* budgetcontroller.calculatebudget();
   budget.calculatebudget();
   var obj=budget.getbudeget();
   ui.displaybudget(obj);*/
   updatebudget();
   }
   };
   var updatebudget=function(){
      budget.calculatebudget();
   var obj=budget.getbudeget();
   ui.displaybudget(obj);
   updatepercentage();
   };
   var updatepercentage=function(){
      budget.calculatePercentage();
      var per=budget.getPercentage();
      console.log(per);
      ui.displaypercentage(per);
   };
   var deleteitem=function(event){
      var targetid,arr,index,ID;
        targetid=(event.target.parentNode.parentNode.parentNode.parentNode.id);
        if(targetid)
        {
           arr=targetid.split('-');
           index=arr[0];
           console.log(index);
           ID=arr[1];
           ID=parseInt(ID);
           console.log(ID);
           budget.delete(index,ID);
        }
        ui.deletehtml(targetid);
        updatebudget();
   };

   return {
      init:function()
      {
         ui.displaymonth();
         console.log("It is working");
         document.querySelector('.add__btn').addEventListener('click',main);
         document.querySelector('.container').addEventListener('click',deleteitem);
      }
   };
   

})(budgetcontroller,UIcontrol);
controller.init();