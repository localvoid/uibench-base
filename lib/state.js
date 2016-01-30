goog.provide('uibench.state');

/** @const {number} */
uibench.state.TABLE_ALPHABET_LENGTH = 10;

/** @const {!Array<string>} */
uibench.state.TABLE_ALPHABETS = [
  '0123456789',
  '3057846291',
  '8356294107',
  '0861342795'
];

/**
 * Home State
 *
 * @constructor
 * @struct
 * @final
 */
uibench.state.HomeState = function() {

};

/**
 * @returns {!uibench.state.HomeState}
 */
uibench.state.HomeState.prototype.clone = function() {
  return new uibench.state.HomeState();
};

/**
 * Table State
 *
 * @param {!Array<!uibench.state.TableItemState>} items
 * @constructor
 * @struct
 * @final
 */
uibench.state.TableState = function(items) {
  this.items = items;
};

/**
 * @returns {!uibench.state.TableState}
 */
uibench.state.TableState.prototype.clone = function() {
  return new uibench.state.TableState(this.items.map(function(i) { return i.clone(); }));
};

/**
 * Create Initial Table State
 *
 * @param {number} rows
 * @param {number} cols
 * @return {!uibench.state.TableState}
 */
uibench.state.TableState.create = function(rows, cols) {
  var items = [];
  for (var i = 0; i < rows; i++) {
    /** @type {!Array<string>} */
    var props = [];
    for (var j = 0; j < cols; j++) {
      // generate col
      var str = '';
      var n = i;

      /** @type {string} */
      var alphabet = uibench.state.TABLE_ALPHABETS[j];

      while (n >= uibench.state.TABLE_ALPHABET_LENGTH) {
        str += /** @type {string} */(alphabet[n % uibench.state.TABLE_ALPHABET_LENGTH]);
        n = n / uibench.state.TABLE_ALPHABET_LENGTH | 0;
      }
      str += /** @type {string} */(alphabet[n % uibench.state.TABLE_ALPHABET_LENGTH]);

      props.push(str);
    }
    items.push(uibench.state.TableItemState.create(false, props));
  }
  return new uibench.state.TableState(items);
};

/**
 * Table Item State
 *
 * @param {number} id
 * @param {boolean} active
 * @param {Array<string>} props
 * @constructor
 * @struct
 * @final
 */
uibench.state.TableItemState = function(id, active, props) {
  this.id = id;
  this.active = active;
  this.props = props;
};

/**
 * @returns {!uibench.state.TableItemState}
 */
uibench.state.TableItemState.prototype.clone = function() {
  return new uibench.state.TableItemState(this.id, this.active, this.props.map(function(i) { return i; }));
};

/**
 * Create a new Table Item State
 *
 * @param {boolean} active
 * @param {Array<string>} props
 * @return {!uibench.state.TableItemState}
 */
uibench.state.TableItemState.create = function(active, props) {
  return new uibench.state.TableItemState(uibench.state.TableItemState._nextId++, active, props);
};

/**
 * @type {number}
 * @private
 */
uibench.state.TableItemState._nextId = 0;

/**
 * Anim State
 *
 * @param {!Array<!uibench.state.AnimBoxState>} items
 * @constructor
 * @struct
 * @final
 */
uibench.state.AnimState = function(items) {
  this.items = items;
};

/**
 * @returns {!uibench.state.AnimState}
 */
uibench.state.AnimState.prototype.clone = function() {
  return new uibench.state.AnimState(this.items.map(function(i) { return i; }));
};

/**
 * Create Anim State
 *
 * @param {number} count
 * @return {!uibench.state.AnimState}
 */
uibench.state.AnimState.create = function(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push(uibench.state.AnimBoxState.create(0));
  }
  return new uibench.state.AnimState(items);
};

/**
 * Anim Box State
 *
 * @param {number} id
 * @param {number} time
 * @constructor
 * @struct
 * @final
 */
uibench.state.AnimBoxState = function(id, time) {
  this.id = id;
  this.time = time;
};

/**
 * @returns {!uibench.state.AnimBoxState}
 */
uibench.state.AnimBoxState.prototype.clone = function() {
  return new uibench.state.AnimBoxState(this.id, this.time);
};

/**
 * Create a new Anim Box State
 *
 * @param {number} time
 * @return {!uibench.state.AnimBoxState}
 */
uibench.state.AnimBoxState.create = function(time) {
  return new uibench.state.AnimBoxState(uibench.state.AnimBoxState._nextId++, time);
};

/**
 * @type {number}
 * @private
 */
uibench.state.AnimBoxState._nextId = 0;

/**
 * Tree State
 *
 * @param {!uibench.state.TreeNodeState} root
 * @constructor
 * @struct
 * @final
 */
uibench.state.TreeState = function(root) {
  this.root = root;
};

/**
 * @returns {!uibench.state.TreeState}
 */
uibench.state.TreeState.prototype.clone = function() {
  return new uibench.state.TreeState(this.root.clone());
};

/**
 * Create Tree State
 *
 * @param {!Array<number>} hierarchy
 * @return {!uibench.state.TreeState}
 */
uibench.state.TreeState.create = function(hierarchy) {
  /**
   * @param {number} depth
   * @return {!Array<uibench.state.TreeNodeState>}
   */
  function _create(depth) {
    var i;
    var count = hierarchy[depth];
    var children = [];

    if (depth === (hierarchy.length - 1)) {
      for (i = 0; i < count; i++) {
        children.push(uibench.state.TreeNodeState.create(false, null))
      }
    } else {
      for (i = 0; i < count; i++) {
        children.push(uibench.state.TreeNodeState.create(true, _create(depth + 1)));
      }
    }
    return children;
  }

  return new uibench.state.TreeState(uibench.state.TreeNodeState.create(true, _create(0)));
};

/**
 * Tree Node State
 *
 * @param {number} id
 * @param {boolean} container
 * @param {Array<!uibench.state.TreeNodeState>} children
 * @constructor
 * @struct
 * @final
 */
uibench.state.TreeNodeState = function(id, container, children) {
  this.id = id;
  this.container = container;
  this.children = children;
};

/**
 *
 * @returns {!uibench.state.TreeNodeState}
 */
uibench.state.TreeNodeState.prototype.clone = function() {
  return new uibench.state.TreeNodeState(this.id, this.container,
      this.children ? this.children.map(function(i) { return i.clone(); }) : this.children);
};

/**
 * Create a new Tree Node State
 *
 * @param {boolean} container
 * @param {Array<!uibench.state.TreeNodeState>} children
 * @return {!uibench.state.TreeNodeState}
 */
uibench.state.TreeNodeState.create = function(container, children) {
  return new uibench.state.TreeNodeState(uibench.state.TreeNodeState._nextId++, container, children);
};

/**
 * @type {number}
 * @private
 */
uibench.state.TreeNodeState._nextId = 0;

/**
 * App State
 *
 * @param {string} location
 * @param {!uibench.state.HomeState} home
 * @param {!uibench.state.TableState} table
 * @param {!uibench.state.AnimState} anim
 * @param {!uibench.state.TreeState} tree
 * @constructor
 * @struct
 * @final
 */
uibench.state.AppState = function(location, home, table, anim, tree) {
  this.location = location;
  this.home = home;
  this.table = table;
  this.anim = anim;
  this.tree = tree;
};

/**
 * @returns {!uibench.state.AppState}
 */
uibench.state.AppState.prototype.clone = function() {
  return new uibench.state.AppState(this.location, this.home.clone(), this.table.clone(),
      this.anim.clone(), this.tree.clone());
};