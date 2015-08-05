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
 * Table State
 *
 * @param {?string} filter
 * @param {?number} sort
 * @param {!Array<!uibench.state.TableItemState>} items
 * @constructor
 * @struct
 * @final
 */
uibench.state.TableState = function(filter, sort, items) {
  this.filter = filter;
  this.sort = sort;
  this.items = items;
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
    items.push(new uibench.state.TableItemState(false, props));
  }
  return new uibench.state.TableState(null, null, items);
};

/**
 * Table Item State
 *
 * @param {boolean} active
 * @param {Array<string>} props
 * @constructor
 * @struct
 * @final
 */
uibench.state.TableItemState = function(active, props) {
  this.id = uibench.state.TableItemState._nextId++;
  this.active = active;
  this.props = props;
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
 * Create Anim State
 *
 * @param {number} count
 * @return {!uibench.state.AnimState}
 */
uibench.state.AnimState.create = function(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push(new uibench.state.AnimBoxState(0));
  }
  return new uibench.state.AnimState(items);
};

/**
 * Anim Box State
 *
 * @param {number} time
 * @constructor
 * @struct
 * @final
 */
uibench.state.AnimBoxState = function(time) {
  this.id = uibench.state.AnimBoxState._nextId++;
  this.time = time;
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
        children.push(new uibench.state.TreeNodeState(false, null))
      }
    } else {
      for (i = 0; i < count; i++) {
        children.push(new uibench.state.TreeNodeState(true, _create(depth + 1)));
      }
    }
    return children;
  }

  return new uibench.state.TreeState(new uibench.state.TreeNodeState(true, _create(0)));
};

/**
 * Tree Node State
 *
 * @param {boolean} container
 * @param {Array<!uibench.state.TreeNodeState>} children
 * @constructor
 * @struct
 * @final
 */
uibench.state.TreeNodeState = function(container, children) {
  this.id = uibench.state.TreeNodeState._nextId++;
  this.container = container;
  this.children = children;
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
