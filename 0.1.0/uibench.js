(function(){'use strict';var uibench={state:{}};uibench.state.TABLE_ALPHABET_LENGTH=10;uibench.state.TABLE_ALPHABETS=["0123456789","3057846291","8356294107","0861342795"];uibench.state.HomeState=function(){};uibench.state.TableState=function(b){this.items=b};
uibench.state.TableState.create=function(b,c){for(var d=[],a=0;a<b;a++){for(var k=[],n=0;n<c;n++){for(var m="",l=a,e=uibench.state.TABLE_ALPHABETS[n];l>=uibench.state.TABLE_ALPHABET_LENGTH;)m+=e[l%uibench.state.TABLE_ALPHABET_LENGTH],l=l/uibench.state.TABLE_ALPHABET_LENGTH|0;m+=e[l%uibench.state.TABLE_ALPHABET_LENGTH];k.push(m)}d.push(uibench.state.TableItemState.create(!1,k))}return new uibench.state.TableState(d)};uibench.state.TableItemState=function(b,c,d){this.id=b;this.active=c;this.props=d};
uibench.state.TableItemState.create=function(b,c){return new uibench.state.TableItemState(uibench.state.TableItemState._nextId++,b,c)};uibench.state.TableItemState._nextId=0;uibench.state.AnimState=function(b){this.items=b};uibench.state.AnimState.create=function(b){for(var c=[],d=0;d<b;d++)c.push(uibench.state.AnimBoxState.create(0));return new uibench.state.AnimState(c)};uibench.state.AnimBoxState=function(b,c){this.id=b;this.time=c};
uibench.state.AnimBoxState.create=function(b){return new uibench.state.AnimBoxState(uibench.state.AnimBoxState._nextId++,b)};uibench.state.AnimBoxState._nextId=0;uibench.state.TreeState=function(b){this.root=b};
uibench.state.TreeState.create=function(b){function c(d){var a,k=b[d],n=[];if(d===b.length-1)for(a=0;a<k;a++)n.push(uibench.state.TreeNodeState.create(!1,null));else for(a=0;a<k;a++)n.push(uibench.state.TreeNodeState.create(!0,c(d+1)));return n}return new uibench.state.TreeState(uibench.state.TreeNodeState.create(!0,c(0)))};uibench.state.TreeNodeState=function(b,c,d){this.id=b;this.container=c;this.children=d};
uibench.state.TreeNodeState.create=function(b,c){return new uibench.state.TreeNodeState(uibench.state.TreeNodeState._nextId++,b,c)};uibench.state.TreeNodeState._nextId=0;uibench.state.AppState=function(b,c,d,a,k){this.location=b;this.home=c;this.table=d;this.anim=a;this.tree=k};uibench.actions={};uibench.actions.switchTo=function(b,c){return b.location===c?b:new uibench.state.AppState(c,b.home,b.table,b.anim,b.tree)};uibench.actions.tableCreate=function(b,c,d){return new uibench.state.AppState(b.location,b.home,uibench.state.TableState.create(c,d),b.anim,b.tree)};uibench.actions.tableFilterBy=function(b,c){for(var d=b.table.items,a=[],k=0;k<d.length;k++)0===k%c&&a.push(d[k]);return new uibench.state.AppState(b.location,b.home,new uibench.state.TableState(a),b.anim,b.tree)};
uibench.actions.tableSortBy=function(b,c){var d=b.table.items.slice();d.sort(function(a,b){return a.props[c].localeCompare(b.props[c])});return new uibench.state.AppState(b.location,b.home,new uibench.state.TableState(d),b.anim,b.tree)};
uibench.actions.tableActivateEach=function(b,c){for(var d=b.table.items,a=[],k=0;k<d.length;k++)0==k%c?a.push(new uibench.state.TableItemState(d[k].id,!0,d[k].props)):a.push(d[k]);return new uibench.state.AppState(b.location,b.home,new uibench.state.TableState(a),b.anim,b.tree)};
uibench.actions.animAdvanceEach=function(b,c){for(var d=b.anim.items,a=[],k=0;k<d.length;k++)0==k%c?a.push(new uibench.state.AnimBoxState(d[k].id,d[k].time+1)):a.push(d[k]);return new uibench.state.AppState(b.location,b.home,b.table,new uibench.state.AnimState(a),b.tree)};uibench.actions.treeCreate=function(b,c){return new uibench.state.AppState(b.location,b.home,b.table,b.anim,uibench.state.TreeState.create(c))};
uibench.actions.treeTransform=function(b,c){function d(a,b){var n=(0,c[b])(a.children);if(b<c.length-1)for(var m=0;m<n.length;m++)n[m]=d(n[m],b+1);return new uibench.state.TreeNodeState(a.id,a.container,n)}return new uibench.state.AppState(b.location,b.home,b.table,b.anim,new uibench.state.TreeState(d(b.tree.root,0)))};uibench.Group=function(b,c,d){this.name=b;this.from=c;this.to=d};uibench.Executor=function(b,c,d,a){this.iterations=b;this.groups=c;this.onUpdate=d;this.onFinish=a;this._samples={};this._currentGroup=0;this._currentGroupState=-1;this._currentIteration=0;this._iter=this._iter.bind(this)};
uibench.Executor.prototype._iter=function(){if(-1===this._currentGroupState)this.onUpdate(this.groups[this._currentGroup].from),this._currentGroupState++,setTimeout(this._iter,0);else if(this._currentGroupState<this.groups[this._currentGroup].to.length){var b=this.groups[this._currentGroup];this.onUpdate(b.from);var c=window.performance.now();this.onUpdate(b.to[this._currentGroupState]);var c=window.performance.now()-c,d=this._samples[b.name];void 0===d&&(d=this._samples[b.name]=[]);d.push(c);this._currentGroupState++;
setTimeout(this._iter,0)}else if(this._currentGroup++,this._currentGroupState=-1,this._currentGroup<this.groups.length)this._iter();else if(this._currentIteration<this.iterations-1)this._currentGroup=0,this._currentIteration++,this._iter();else this.onFinish(this._samples)};uibench.Executor.prototype.run=function(){this._iter()};uibench.tree_transformers={};uibench.tree_transformers.skip=function(b){return b.slice()};uibench.tree_transformers.reverse=function(b){b=b.slice();b.reverse();return b};uibench.tree_transformers.insertFirst=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.unshift(uibench.state.TreeNodeState.create(!1,null));return c}};uibench.tree_transformers.insertLast=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.push(uibench.state.TreeNodeState.create(!1,null));return c}};
uibench.tree_transformers.removeFirst=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.shift();return c}};uibench.tree_transformers.removeLast=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.pop();return c}};uibench.tree_transformers.moveFromEndToStart=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.unshift(c.pop());return c}};
uibench.tree_transformers.moveFromStartToEnd=function(b){return function(c){c=c.slice();for(var d=0;d<b;d++)c.push(c.shift());return c}};uibench.TABLE_ROWS=100;uibench.TABLE_COLS=4;uibench.ANIM_COUNT=100;uibench.tests=null;uibench.iterations=3;uibench.name="unnamed";uibench.version="0.0.0";uibench.report=!1;uibench.mobile=!1;
uibench.init=function(b,c){function d(a,b,c){for(var d=[],e=0;e<c;e++)a=uibench.actions.animAdvanceEach(a,b),d.push(a);return d}function a(a,b){for(var c=[];0<b;)c.push(a),b--;return c}uibench.name=b;uibench.version=c;var k=function(a){if(0===a.length)return{};for(var b={},c=0;c<a.length;++c){var d=a[c].split("=",2);b[d[0]]=1==d.length?"":decodeURIComponent(d[1].replace(/\+/g," "))}return b}(window.location.search.substr(1).split("&"));void 0!==k.i&&(uibench.iterations=parseInt(k.i,10));void 0!==
k.name&&(uibench.name=k.name);void 0!==k.version&&(uibench.version=k.version);void 0!==k.report&&(uibench.report=!0);void 0!==k.mobile&&(uibench.mobile=!0);var k=new uibench.state.AppState("home",new uibench.state.HomeState,uibench.state.TableState.create(0,0),uibench.state.AnimState.create(uibench.mobile?30:100),uibench.state.TreeState.create([0])),n=uibench.actions.switchTo(k,"table"),m=uibench.actions.switchTo(k,"anim"),l=uibench.actions.switchTo(k,"tree");if(uibench.mobile){var e=uibench.actions.tableCreate(n,
30,4),f=uibench.actions.tableCreate(n,15,4),g=uibench.actions.tableCreate(n,30,2),h=uibench.actions.tableCreate(n,15,2),p=uibench.actions.treeCreate(l,[50]),q=uibench.actions.treeCreate(l,[5,10]),l=uibench.actions.treeCreate(l,[10,5]);uibench.tests=[new uibench.Group("table/[30,4]/render",n,a(e,3)),new uibench.Group("table/[15,4]/render",n,a(f,3)),new uibench.Group("table/[30,2]/render",n,a(g,3)),new uibench.Group("table/[15,2]/render",n,a(h,3)),new uibench.Group("table/[30,4]/sort/0",e,a(uibench.actions.tableSortBy(e,
0),3)),new uibench.Group("table/[15,4]/sort/0",f,a(uibench.actions.tableSortBy(f,0),3)),new uibench.Group("table/[30,2]/sort/0",g,a(uibench.actions.tableSortBy(g,0),3)),new uibench.Group("table/[15,2]/sort/0",h,a(uibench.actions.tableSortBy(h,0),3)),new uibench.Group("table/[30,4]/sort/1",e,a(uibench.actions.tableSortBy(e,1),3)),new uibench.Group("table/[15,4]/sort/1",f,a(uibench.actions.tableSortBy(f,1),3)),new uibench.Group("table/[30,2]/sort/1",g,a(uibench.actions.tableSortBy(g,1),3)),new uibench.Group("table/[15,2]/sort/1",
h,a(uibench.actions.tableSortBy(h,1),3)),new uibench.Group("table/[30,4]/filter/32",e,a(uibench.actions.tableFilterBy(e,32),3)),new uibench.Group("table/[15,4]/filter/32",f,a(uibench.actions.tableFilterBy(f,32),3)),new uibench.Group("table/[30,2]/filter/32",g,a(uibench.actions.tableFilterBy(g,32),3)),new uibench.Group("table/[15,2]/filter/32",h,a(uibench.actions.tableFilterBy(h,32),3)),new uibench.Group("table/[30,4]/filter/16",e,a(uibench.actions.tableFilterBy(e,16),3)),new uibench.Group("table/[15,4]/filter/16",
f,a(uibench.actions.tableFilterBy(f,16),3)),new uibench.Group("table/[30,2]/filter/16",g,a(uibench.actions.tableFilterBy(g,16),3)),new uibench.Group("table/[15,2]/filter/16",h,a(uibench.actions.tableFilterBy(h,16),3)),new uibench.Group("table/[30,4]/filter/8",e,a(uibench.actions.tableFilterBy(e,8),3)),new uibench.Group("table/[15,4]/filter/8",f,a(uibench.actions.tableFilterBy(f,8),3)),new uibench.Group("table/[30,2]/filter/8",g,a(uibench.actions.tableFilterBy(g,8),3)),new uibench.Group("table/[15,2]/filter/8",
h,a(uibench.actions.tableFilterBy(h,8),3)),new uibench.Group("table/[30,4]/filter/4",e,a(uibench.actions.tableFilterBy(e,4),3)),new uibench.Group("table/[15,4]/filter/4",f,a(uibench.actions.tableFilterBy(f,4),3)),new uibench.Group("table/[30,2]/filter/4",g,a(uibench.actions.tableFilterBy(g,4),3)),new uibench.Group("table/[15,2]/filter/4",h,a(uibench.actions.tableFilterBy(h,4),3)),new uibench.Group("table/[30,4]/filter/2",e,a(uibench.actions.tableFilterBy(e,2),3)),new uibench.Group("table/[15,4]/filter/2",
f,a(uibench.actions.tableFilterBy(f,2),3)),new uibench.Group("table/[30,2]/filter/2",g,a(uibench.actions.tableFilterBy(g,2),3)),new uibench.Group("table/[15,2]/filter/2",h,a(uibench.actions.tableFilterBy(h,2),3)),new uibench.Group("table/[30,4]/activate/32",e,a(uibench.actions.tableActivateEach(e,32),3)),new uibench.Group("table/[15,4]/activate/32",f,a(uibench.actions.tableActivateEach(f,32),3)),new uibench.Group("table/[30,2]/activate/32",g,a(uibench.actions.tableActivateEach(g,32),3)),new uibench.Group("table/[15,2]/activate/32",
h,a(uibench.actions.tableActivateEach(h,32),3)),new uibench.Group("table/[30,4]/activate/16",e,a(uibench.actions.tableActivateEach(e,16),3)),new uibench.Group("table/[15,4]/activate/16",f,a(uibench.actions.tableActivateEach(f,16),3)),new uibench.Group("table/[30,2]/activate/16",g,a(uibench.actions.tableActivateEach(g,16),3)),new uibench.Group("table/[15,2]/activate/16",h,a(uibench.actions.tableActivateEach(h,16),3)),new uibench.Group("table/[30,4]/activate/8",e,a(uibench.actions.tableActivateEach(e,
8),3)),new uibench.Group("table/[15,4]/activate/8",f,a(uibench.actions.tableActivateEach(f,8),3)),new uibench.Group("table/[30,2]/activate/8",g,a(uibench.actions.tableActivateEach(g,8),3)),new uibench.Group("table/[15,2]/activate/8",h,a(uibench.actions.tableActivateEach(h,8),3)),new uibench.Group("table/[30,4]/activate/4",e,a(uibench.actions.tableActivateEach(e,4),3)),new uibench.Group("table/[15,4]/activate/4",f,a(uibench.actions.tableActivateEach(f,4),3)),new uibench.Group("table/[30,2]/activate/4",
g,a(uibench.actions.tableActivateEach(g,4),3)),new uibench.Group("table/[15,2]/activate/4",h,a(uibench.actions.tableActivateEach(h,4),3)),new uibench.Group("table/[30,4]/activate/2",e,a(uibench.actions.tableActivateEach(e,2),3)),new uibench.Group("table/[15,4]/activate/2",f,a(uibench.actions.tableActivateEach(f,2),3)),new uibench.Group("table/[30,2]/activate/2",g,a(uibench.actions.tableActivateEach(g,2),3)),new uibench.Group("table/[15,2]/activate/2",h,a(uibench.actions.tableActivateEach(h,2),3)),
new uibench.Group("table/[30,4]/activate/1",e,a(uibench.actions.tableActivateEach(e,1),3)),new uibench.Group("table/[15,4]/activate/1",f,a(uibench.actions.tableActivateEach(f,1),3)),new uibench.Group("table/[30,2]/activate/1",g,a(uibench.actions.tableActivateEach(g,1),3)),new uibench.Group("table/[15,2]/activate/1",h,a(uibench.actions.tableActivateEach(h,1),3)),new uibench.Group("anim/30/8",m,d(m,8,3)),new uibench.Group("anim/30/4",m,d(m,4,3)),new uibench.Group("anim/30/2",m,d(m,2,3)),new uibench.Group("anim/30/1",
m,d(m,1,3)),new uibench.Group("tree/[50]/render",k,a(p,3)),new uibench.Group("tree/[5,10]/render",k,a(q,3)),new uibench.Group("tree/[10,5]/render",k,a(l,3)),new uibench.Group("tree/[50]/[reverse]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.reverse]),3)),new uibench.Group("tree/[5,10]/[reverse]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.reverse]),3)),new uibench.Group("tree/[10,5]/[reverse]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.reverse]),
3)),new uibench.Group("tree/[50]/[insertFirst(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.insertFirst(1)]),3)),new uibench.Group("tree/[5,10]/[insertFirst(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.insertFirst(1)]),3)),new uibench.Group("tree/[10,5]/[insertFirst(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.insertFirst(1)]),3)),new uibench.Group("tree/[50]/[insertLast(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.insertLast(1)]),
3)),new uibench.Group("tree/[5,10]/[insertLast(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.insertLast(1)]),3)),new uibench.Group("tree/[10,5]/[insertLast(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.insertLast(1)]),3)),new uibench.Group("tree/[50]/[removeFirst(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.removeFirst(1)]),3)),new uibench.Group("tree/[5,10]/[removeFirst(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.removeFirst(1)]),
3)),new uibench.Group("tree/[10,5]/[removeFirst(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.removeFirst(1)]),3)),new uibench.Group("tree/[50]/[removeLast(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.removeLast(1)]),3)),new uibench.Group("tree/[5,10]/[removeLast(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.removeLast(1)]),3)),new uibench.Group("tree/[10,5]/[removeLast(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.removeLast(1)]),
3)),new uibench.Group("tree/[50]/[moveFromEndToStart(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.moveFromEndToStart(1)]),3)),new uibench.Group("tree/[5,10]/[moveFromEndToStart(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.moveFromEndToStart(1)]),3)),new uibench.Group("tree/[10,5]/[moveFromEndToStart(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.moveFromEndToStart(1)]),3)),new uibench.Group("tree/[50]/[moveFromStartToEnd(1)]",p,a(uibench.actions.treeTransform(p,
[uibench.tree_transformers.moveFromStartToEnd(1)]),3)),new uibench.Group("tree/[5,10]/[moveFromStartToEnd(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.moveFromStartToEnd(1)]),3)),new uibench.Group("tree/[10,5]/[moveFromStartToEnd(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.moveFromStartToEnd(1)]),3))]}else{var e=uibench.actions.tableCreate(n,100,4),f=uibench.actions.tableCreate(n,50,4),g=uibench.actions.tableCreate(n,100,2),h=uibench.actions.tableCreate(n,
50,2),p=uibench.actions.treeCreate(l,[500]),q=uibench.actions.treeCreate(l,[50,10]),r=uibench.actions.treeCreate(l,[10,50]),l=uibench.actions.treeCreate(l,[5,100]);uibench.tests=[new uibench.Group("table/[100,4]/render",n,a(e,5)),new uibench.Group("table/[50,4]/render",n,a(f,5)),new uibench.Group("table/[100,2]/render",n,a(g,5)),new uibench.Group("table/[50,2]/render",n,a(h,5)),new uibench.Group("table/[100,4]/sort/0",e,a(uibench.actions.tableSortBy(e,0),5)),new uibench.Group("table/[50,4]/sort/0",
f,a(uibench.actions.tableSortBy(f,0),5)),new uibench.Group("table/[100,2]/sort/0",g,a(uibench.actions.tableSortBy(g,0),5)),new uibench.Group("table/[50,2]/sort/0",h,a(uibench.actions.tableSortBy(h,0),5)),new uibench.Group("table/[100,4]/sort/1",e,a(uibench.actions.tableSortBy(e,1),5)),new uibench.Group("table/[50,4]/sort/1",f,a(uibench.actions.tableSortBy(f,1),5)),new uibench.Group("table/[100,2]/sort/1",g,a(uibench.actions.tableSortBy(g,1),5)),new uibench.Group("table/[50,2]/sort/1",h,a(uibench.actions.tableSortBy(h,
1),5)),new uibench.Group("table/[100,4]/sort/2",e,a(uibench.actions.tableSortBy(e,2),5)),new uibench.Group("table/[50,4]/sort/2",f,a(uibench.actions.tableSortBy(f,2),5)),new uibench.Group("table/[100,4]/sort/3",e,a(uibench.actions.tableSortBy(e,3),5)),new uibench.Group("table/[50,4]/sort/3",f,a(uibench.actions.tableSortBy(f,3),5)),new uibench.Group("table/[100,4]/filter/32",e,a(uibench.actions.tableFilterBy(e,32),5)),new uibench.Group("table/[50,4]/filter/32",f,a(uibench.actions.tableFilterBy(f,32),
5)),new uibench.Group("table/[100,2]/filter/32",g,a(uibench.actions.tableFilterBy(g,32),5)),new uibench.Group("table/[50,2]/filter/32",h,a(uibench.actions.tableFilterBy(h,32),5)),new uibench.Group("table/[100,4]/filter/16",e,a(uibench.actions.tableFilterBy(e,16),5)),new uibench.Group("table/[50,4]/filter/16",f,a(uibench.actions.tableFilterBy(f,16),5)),new uibench.Group("table/[100,2]/filter/16",g,a(uibench.actions.tableFilterBy(g,16),5)),new uibench.Group("table/[50,2]/filter/16",h,a(uibench.actions.tableFilterBy(h,
16),5)),new uibench.Group("table/[100,4]/filter/8",e,a(uibench.actions.tableFilterBy(e,8),5)),new uibench.Group("table/[50,4]/filter/8",f,a(uibench.actions.tableFilterBy(f,8),5)),new uibench.Group("table/[100,2]/filter/8",g,a(uibench.actions.tableFilterBy(g,8),5)),new uibench.Group("table/[50,2]/filter/8",h,a(uibench.actions.tableFilterBy(h,8),5)),new uibench.Group("table/[100,4]/filter/4",e,a(uibench.actions.tableFilterBy(e,4),5)),new uibench.Group("table/[50,4]/filter/4",f,a(uibench.actions.tableFilterBy(f,
4),5)),new uibench.Group("table/[100,2]/filter/4",g,a(uibench.actions.tableFilterBy(g,4),5)),new uibench.Group("table/[50,2]/filter/4",h,a(uibench.actions.tableFilterBy(h,4),5)),new uibench.Group("table/[100,4]/filter/2",e,a(uibench.actions.tableFilterBy(e,2),5)),new uibench.Group("table/[50,4]/filter/2",f,a(uibench.actions.tableFilterBy(f,2),5)),new uibench.Group("table/[100,2]/filter/2",g,a(uibench.actions.tableFilterBy(g,2),5)),new uibench.Group("table/[50,2]/filter/2",h,a(uibench.actions.tableFilterBy(h,
2),5)),new uibench.Group("table/[100,4]/activate/32",e,a(uibench.actions.tableActivateEach(e,32),5)),new uibench.Group("table/[50,4]/activate/32",f,a(uibench.actions.tableActivateEach(f,32),5)),new uibench.Group("table/[100,2]/activate/32",g,a(uibench.actions.tableActivateEach(g,32),5)),new uibench.Group("table/[50,2]/activate/32",h,a(uibench.actions.tableActivateEach(h,32),5)),new uibench.Group("table/[100,4]/activate/16",e,a(uibench.actions.tableActivateEach(e,16),5)),new uibench.Group("table/[50,4]/activate/16",
f,a(uibench.actions.tableActivateEach(f,16),5)),new uibench.Group("table/[100,2]/activate/16",g,a(uibench.actions.tableActivateEach(g,16),5)),new uibench.Group("table/[50,2]/activate/16",h,a(uibench.actions.tableActivateEach(h,16),5)),new uibench.Group("table/[100,4]/activate/8",e,a(uibench.actions.tableActivateEach(e,8),5)),new uibench.Group("table/[50,4]/activate/8",f,a(uibench.actions.tableActivateEach(f,8),5)),new uibench.Group("table/[100,2]/activate/8",g,a(uibench.actions.tableActivateEach(g,
8),5)),new uibench.Group("table/[50,2]/activate/8",h,a(uibench.actions.tableActivateEach(h,8),5)),new uibench.Group("table/[100,4]/activate/4",e,a(uibench.actions.tableActivateEach(e,4),5)),new uibench.Group("table/[50,4]/activate/4",f,a(uibench.actions.tableActivateEach(f,4),5)),new uibench.Group("table/[100,2]/activate/4",g,a(uibench.actions.tableActivateEach(g,4),5)),new uibench.Group("table/[50,2]/activate/4",h,a(uibench.actions.tableActivateEach(h,4),5)),new uibench.Group("table/[100,4]/activate/2",
e,a(uibench.actions.tableActivateEach(e,2),5)),new uibench.Group("table/[50,4]/activate/2",f,a(uibench.actions.tableActivateEach(f,2),5)),new uibench.Group("table/[100,2]/activate/2",g,a(uibench.actions.tableActivateEach(g,2),5)),new uibench.Group("table/[50,2]/activate/2",h,a(uibench.actions.tableActivateEach(h,2),5)),new uibench.Group("table/[100,4]/activate/1",e,a(uibench.actions.tableActivateEach(e,1),5)),new uibench.Group("table/[50,4]/activate/1",f,a(uibench.actions.tableActivateEach(f,1),5)),
new uibench.Group("table/[100,2]/activate/1",g,a(uibench.actions.tableActivateEach(g,1),5)),new uibench.Group("table/[50,2]/activate/1",h,a(uibench.actions.tableActivateEach(h,1),5)),new uibench.Group("anim/100/32",m,d(m,32,5)),new uibench.Group("anim/100/16",m,d(m,16,5)),new uibench.Group("anim/100/8",m,d(m,8,5)),new uibench.Group("anim/100/4",m,d(m,4,5)),new uibench.Group("anim/100/2",m,d(m,2,5)),new uibench.Group("anim/100/1",m,d(m,1,5)),new uibench.Group("tree/[500]/render",k,a(p,5)),new uibench.Group("tree/[50,10]/render",
k,a(q,5)),new uibench.Group("tree/[10,50]/render",k,a(r,5)),new uibench.Group("tree/[5,100]/render",k,a(l,5)),new uibench.Group("tree/[500]/[reverse]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.reverse]),5)),new uibench.Group("tree/[50,10]/[reverse]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.reverse]),5)),new uibench.Group("tree/[10,50]/[reverse]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.reverse]),5)),new uibench.Group("tree/[5,100]/[reverse]",
l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.reverse]),5)),new uibench.Group("tree/[500]/[insertFirst(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.insertFirst(1)]),5)),new uibench.Group("tree/[50,10]/[insertFirst(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.insertFirst(1)]),5)),new uibench.Group("tree/[10,50]/[insertFirst(1)]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.insertFirst(1)]),5)),new uibench.Group("tree/[5,100]/[insertFirst(1)]",
l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.insertFirst(1)]),5)),new uibench.Group("tree/[500]/[insertLast(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.insertLast(1)]),5)),new uibench.Group("tree/[50,10]/[insertLast(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.insertLast(1)]),5)),new uibench.Group("tree/[10,50]/[insertLast(1)]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.insertLast(1)]),5)),new uibench.Group("tree/[5,100]/[insertLast(1)]",
l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.insertLast(1)]),5)),new uibench.Group("tree/[500]/[removeFirst(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.removeFirst(1)]),5)),new uibench.Group("tree/[50,10]/[removeFirst(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.removeFirst(1)]),5)),new uibench.Group("tree/[10,50]/[removeFirst(1)]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.removeFirst(1)]),5)),new uibench.Group("tree/[5,100]/[removeFirst(1)]",
l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.removeFirst(1)]),5)),new uibench.Group("tree/[500]/[removeLast(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.removeLast(1)]),5)),new uibench.Group("tree/[50,10]/[removeLast(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.removeLast(1)]),5)),new uibench.Group("tree/[10,50]/[removeLast(1)]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.removeLast(1)]),5)),new uibench.Group("tree/[5,100]/[removeLast(1)]",
l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.removeLast(1)]),5)),new uibench.Group("tree/[500]/[moveFromEndToStart(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.moveFromEndToStart(1)]),5)),new uibench.Group("tree/[50,10]/[moveFromEndToStart(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.moveFromEndToStart(1)]),5)),new uibench.Group("tree/[10,50]/[moveFromEndToStart(1)]",r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.moveFromEndToStart(1)]),
5)),new uibench.Group("tree/[5,100]/[moveFromEndToStart(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.moveFromEndToStart(1)]),5)),new uibench.Group("tree/[500]/[moveFromStartToEnd(1)]",p,a(uibench.actions.treeTransform(p,[uibench.tree_transformers.moveFromStartToEnd(1)]),5)),new uibench.Group("tree/[50,10]/[moveFromStartToEnd(1)]",q,a(uibench.actions.treeTransform(q,[uibench.tree_transformers.moveFromStartToEnd(1)]),5)),new uibench.Group("tree/[10,50]/[moveFromStartToEnd(1)]",
r,a(uibench.actions.treeTransform(r,[uibench.tree_transformers.moveFromStartToEnd(1)]),5)),new uibench.Group("tree/[5,100]/[moveFromStartToEnd(1)]",l,a(uibench.actions.treeTransform(l,[uibench.tree_transformers.moveFromStartToEnd(1)]),5))]}};"undefined"===typeof window.performance&&(window.performance={});
if(!window.performance.now){var nowOffset=Date.now();window.performance.timing&&window.performance.timing.navigationStart&&(nowOffset=window.performance.timing.navigationStart);window.performance.now=function(){return Date.now()-nowOffset}};uibench.run=function(b,c,d){var a=uibench.tests;if(void 0!==d){for(var k=a,n=0;n<uibench.tests;n++){var m=a[n];-1!==m.name.indexOf(d)&&k.push(m)}a=k}(new uibench.Executor(uibench.iterations,a,b,function(a){c(a);uibench.report&&window.opener.postMessage({type:"report",data:{name:uibench.name,version:uibench.version,samples:a}},"*")})).run()};uibench.export={};window.uibench={init:uibench.init,run:uibench.run};}).call();
