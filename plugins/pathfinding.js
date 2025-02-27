// This is based on what I found here
// PathFinderPlugin License: MIT.
// Copyright (c) 2013 appsbu-de
// https://github.com/appsbu-de/phaser_plugin_pathfinding
// I just made a few changes to get it working with phaser 3


(function(){

    const EasyStar = {};

    EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.costSoFar = costSoFar;
        this.simpleDistanceToTarget = simpleDistanceToTarget;
        this.bestGuessDistance = function() {
	    return this.costSoFar + this.simpleDistanceToTarget;
        }
    };

    EasyStar.Node.OPEN_LIST = 0;
    EasyStar.Node.CLOSED_LIST = 1;

    EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		bubbleUp(this.length-1);
	}

	this.getHighestPriorityElement = function() {
		return queue[0];
	}

	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		swapUntilQueueIsCorrect(0);
		return oldRoot;
	}

	var bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = getParentOf(index);
		if (evaluate(index,parent)) {
			swap(index,parent);
			bubbleUp(parent);
		} else {
			return;
		}
	}

	var swapUntilQueueIsCorrect = function(value) {
		var left = getLeftOf(value);
		var right = getRightOf(value);
		if (evaluate(left,value)) {
			swap(value,left);
			swapUntilQueueIsCorrect(left);
		} else if (evaluate(right,value)) {
			swap(value,right);
			swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			swapUntilQueueIsCorrect(0);
		}
	}

	var swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	}

	var evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}
		
		var selfValue;
		var targetValue;
		
		//Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			selfValue = queue[self][criteria]();
			targetValue = queue[target][criteria]();
		} else {
			selfValue = queue[self][criteria];
			targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	}

	var getParentOf = function(index) {
		return Math.floor(index/2)-1;
	}

	var getLeftOf = function(index) {
		return index*2 + 1;
	}

	var getRightOf = function(index) {
		return index*2 + 2;
	}
    };

    EasyStar.PriorityQueue.MAX_HEAP = 0;
    EasyStar.PriorityQueue.MIN_HEAP = 1;

    EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
    };
    EasyStar.js = function() {
	var STRAIGHT_COST = 10;
	var DIAGONAL_COST = 14;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			//Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			//Number
			acceptableTiles = [tiles];
		}
	};

	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	}

	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	}

	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};
	
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	this.findPath = function(startX, startY ,endX, endY, callback) {
		//No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw "You can't set a path without first calling setAcceptableTiles() on EasyStar.";
		}
		//No grid was set
		if (collisionGrid === undefined) {
			throw "You can't set a path without first calling setGrid() on EasyStar.";
		}

		//Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 || 
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw "Your start or end point is outside the scope of your grid.";
		}

		//Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callback([]);
		}

		//End point is not an acceptable tile.
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callback(null);
			return;
		}

		//Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callback;
		
		instance.openList.insert(coordinateToNode(instance, instance.startX, 
			instance.startY, null, STRAIGHT_COST));
		
		instances.push(instance);
	};

	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			//Couldn't find a path.
			if (instances[0].openList.length===0) {
				instances[0].callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST * 
					costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.y < collisionGrid.length-1) {
				checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x > 0) {
				checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
			}
		}
	};


	var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;
		
		if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
			instance.isDoneCalculating = true;
			var path = [];
			var pathLen = 0;
			path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
			pathLen++;
			path[pathLen] = {x: searchNode.x, y:searchNode.y};
			pathLen++;
			var parent = searchNode.parent;
			while (parent!=null) {
				path[pathLen] = {x: parent.x, y:parent.y};
				pathLen++;
				parent = parent.parent;
			}
			path.reverse();
			instance.callback(path);
		}

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {
					
					var node = coordinateToNode(instance, adjacentCoordinateX, 
						adjacentCoordinateY, searchNode, cost);
					
					if (node.list === undefined) {
						node.list = EasyStar.Node.OPEN_LIST;
						instance.openList.insert(node);
					} else if (node.list === EasyStar.Node.OPEN_LIST) {
						if (searchNode.costSoFar + cost < node.costSoFar) {
							node.costSoFar = searchNode.costSoFar + cost;
							node.parent = searchNode;
						}
					}
					break;
				}
			}

		}
	};

	var coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1)) * STRAIGHT_COST;
	};
    }



    const root = this;

    class PathFinderPlugin extends Phaser.Plugins.BasePlugin {

        constructor (pluginManager) {
            super(pluginManager);
            if (typeof EasyStar !== 'object') {
                throw new Error("Easystar is not defined!");
            }
            this.parent = parent;
            this._easyStar = new EasyStar.js();
            this._grid = null;
            this._callback = null;
            this._prepared = false;
            this._walkables = [0];
        }
        
        setGrid (grid, walkables, iterationsPerCount) {
            iterationsPerCount = iterationsPerCount || null;
            this._grid = [];
            for (var i = 0; i < grid.length; i++) {
                this._grid[i] = [];
                for (var j = 0; j < grid[i].length; j++){
                    if (grid[i][j])
                    this._grid[i][j] = grid[i][j].index;
                else
                    this._grid[i][j] = 0
                }
            }
            this._walkables = walkables;
            this._easyStar.setGrid(this._grid);
            this._easyStar.setAcceptableTiles(this._walkables);
            // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
            for (i = 0; i < walkables.length; i++){
                this.setTileCost(walkables[i], 1);
            }
            if (iterationsPerCount !== null) {
                this._easyStar.setIterationsPerCalculation(iterationsPerCount);
            }
        }
        
        setTileCost (tileType, cost) {
            this._easyStar.setTileCost(tileType, cost);
        }
        
        setCallbackFunction (callback) {
            this._callback = callback;
        }
        
        preparePathCalculation (from, to) {
            if (this._callback === null || typeof this._callback !== "function") {
                throw new Error("No Callback set!");
            }

            var startX = from[0],
            startY = from[1],
            destinationX = to[0],
            destinationY = to[1];

            this._easyStar.findPath(startX, startY, destinationX, destinationY, this._callback);
            this._prepared = true;
        }
        
        calculatePath  () {
            if (this._prepared === null) {
                throw new Error("no Calculation prepared!");
            }

            this._easyStar.calculate();
        }

    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PathFinderPlugin;
        }
        exports.PathFinderPlugin = PathFinderPlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PathFinderPlugin', (function() { return root.PathFinderPlugin = PathFinderPlugin; })() );
    } else {
        root.PathFinderPlugin = PathFinderPlugin;
    }

    return PathFinderPlugin;
}).call(this);

