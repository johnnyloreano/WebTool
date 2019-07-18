/*! The file full_ui_all.js contains the following files: Detector.js,
 * CanvasRenderer.js, TrackballControls.js, OrthographicTrackballControls.js,
 * Projector.js, marchingcube.js, ProteinSurface4.js, setupsurface.js, icn3d.js,
 * and full_ui.js.
 * The file simple_ui_all.js contains the following files: Detector.js,
 * CanvasRenderer.js, TrackballControls.js, OrthographicTrackballControls.js,
 * Projector.js, marchingcube.js, ProteinSurface4.js, setupsurface.js, icn3d.js,
 * and simple_ui.js.
 */

/*! Detector.js from http://threejs.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () {

        try {

            var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

        } catch ( e ) {

            return false;

        }

    } )(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function () {

        var element = document.createElement( 'div' );
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if ( ! this.webgl ) {

            element.innerHTML = window.WebGLRenderingContext ? [
                'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join( '\n' ) : [
                'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join( '\n' );

        }

        return element;

    },

    addGetWebGLMessage: function ( parameters ) {

        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild( element );

    }

};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = Detector;

}

/*! TrackballControls.js from http://threejs.org/
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 * modified by Jiyao Wang
 */

THREE.TrackballControls = function ( object, domElement, icn3d ) {

    var _this = this;

    this.STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API
    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    this._state = this.STATE.NONE;
    var _prevState = this.STATE.NONE;

    var _eye = new THREE.Vector3();

    this._rotateStart = new THREE.Vector3();
    this._rotateEnd = new THREE.Vector3();

    this._zoomStart = new THREE.Vector2();
    this._zoomEnd = new THREE.Vector2();

    var _touchZoomDistanceStart = 0;
    var _touchZoomDistanceEnd = 0;

    this._panStart = new THREE.Vector2();
    this._panEnd = new THREE.Vector2();

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start'};
    var endEvent = { type: 'end'};


    // methods

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;

        }

    };

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] === 'function' ) {

            this[ event.type ]( event );

        }

    };

    var getMouseOnScreen = ( function () {

        var vector = new THREE.Vector2();

        return function ( pageX, pageY ) {

            vector.set(
                ( pageX - _this.screen.left ) / _this.screen.width,
                ( pageY - _this.screen.top ) / _this.screen.height
            );

            return vector;

        };

    }() );

    var getMouseProjectionOnBall = ( function () {

        var vector = new THREE.Vector3();
        var objectUp = new THREE.Vector3();
        var mouseOnBall = new THREE.Vector3();

        return function ( pageX, pageY ) {

            mouseOnBall.set(
                ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
                ( _this.screen.height * 0.5 + _this.screen.top - pageY ) / (_this.screen.height*.5),
                0.0
            );

            var length = mouseOnBall.length();

            if ( _this.noRoll ) {

                if ( length < Math.SQRT1_2 ) {

                    mouseOnBall.z = Math.sqrt( 1.0 - length*length );

                } else {

                    mouseOnBall.z = .5 / length;

                }

            } else if ( length > 1.0 ) {

                mouseOnBall.normalize();

            } else {

                mouseOnBall.z = Math.sqrt( 1.0 - length * length );

            }

            _eye.copy( _this.object.position ).sub( _this.target );

            vector.copy( _this.object.up ).setLength( mouseOnBall.y )
            vector.add( objectUp.copy( _this.object.up ).cross( _eye ).setLength( mouseOnBall.x ) );
            vector.add( _eye.setLength( mouseOnBall.z ) );

            return vector;

        };

    }() );

    this.rotateCamera = (function(quaternionIn, bUpdate){

        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();


        return function (quaternionIn, bUpdate) {

            var angle;
            if(quaternionIn === undefined) {
              angle = Math.acos( _this._rotateStart.dot( _this._rotateEnd ) / _this._rotateStart.length() / _this._rotateEnd.length() );
            }

            //var angle = Math.acos( _this._rotateStart.dot( _this._rotateEnd ) / _this._rotateStart.length() / _this._rotateEnd.length() );

            if ( angle || quaternionIn !== undefined) {
                if(quaternionIn === undefined) {
                  axis.crossVectors( _this._rotateStart, _this._rotateEnd ).normalize();

                  angle *= _this.rotateSpeed;

                  quaternion.setFromAxisAngle( axis, -angle );
                }
                else {
                  quaternion.copy(quaternionIn);
                }

                // order matters in quaernion multiplication: http://www.cprogramming.com/tutorial/3d/quaternions.html
                if(bUpdate === undefined || bUpdate === true) icn3d.quaternion.multiplyQuaternions(quaternion, icn3d.quaternion);

                _eye.applyQuaternion( quaternion );
                _this.object.up.applyQuaternion( quaternion );

                _this._rotateEnd.applyQuaternion( quaternion );

                if ( _this.staticMoving ) {

                    _this._rotateStart.copy( _this._rotateEnd );

                } else {

                    quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
                    _this._rotateStart.applyQuaternion( quaternion );

                }
            }

        }

    }());

    this.zoomCamera = function (zoomFactor, bUpdate) {
        if ( _this._state === _this.STATE.TOUCH_ZOOM_PAN ) {

            var factor;

            if(zoomFactor !== undefined) {
              factor = zoomFactor;
            }
            else {

              factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
              _touchZoomDistanceStart = _touchZoomDistanceEnd;
            }

            _eye.multiplyScalar( factor );

            if(bUpdate === undefined || bUpdate === true) icn3d._zoomFactor *= factor;

        } else {

            var factor;

            if(zoomFactor !== undefined) {
              factor = zoomFactor;
            }
            else {
              factor = 1.0 + ( _this._zoomEnd.y - _this._zoomStart.y ) * _this.zoomSpeed;
            }

            if(bUpdate === undefined || bUpdate === true) icn3d._zoomFactor *= factor;

            //if ( factor !== 1.0 && factor > 0.0 ) {
            if ( factor !== 1.0 ) {

                _eye.multiplyScalar( factor );

                if ( _this.staticMoving ) {

                    _this._zoomStart.copy( _this._zoomEnd );

                } else {

                    _this._zoomStart.y += ( _this._zoomEnd.y - _this._zoomStart.y ) * this.dynamicDampingFactor;
                }
            }

        }

    };

    this.panCamera = (function(mouseChangeIn, bUpdate){

        var mouseChange = new THREE.Vector2(),
            objectUp = new THREE.Vector3(),
            pan = new THREE.Vector3();

        return function (mouseChangeIn, bUpdate) {

            if(mouseChangeIn !== undefined) {
              mouseChange = mouseChangeIn;

              if(bUpdate === undefined || bUpdate === true) icn3d.mouseChange.add(mouseChangeIn);
            }
            else {
              mouseChange.copy( _this._panEnd ).sub( _this._panStart );

              if(bUpdate === undefined || bUpdate === true) icn3d.mouseChange.add( _this._panEnd ).sub( _this._panStart );
            }

            if ( mouseChange.lengthSq() ) {
                mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

                pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
                pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

                _this.object.position.add( pan );
                _this.target.add( pan );

                if ( _this.staticMoving ) {

                    _this._panStart.copy( _this._panEnd );

                } else {

                    _this._panStart.add( mouseChange.subVectors( _this._panEnd, _this._panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

                }

            }
        }

    }());

    this.checkDistances = function () {

        if ( !_this.noZoom || !_this.noPan ) {

            if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

                _this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );

            }

            if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

                _this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );

            }

        }

    };

    this.update = function (para) {

        _eye.subVectors( _this.object.position, _this.target );

        if ( !_this.noRotate ) {

            if(para !== undefined && para.quaternion !== undefined) {
              _this.rotateCamera(para.quaternion, para.update);
            }
            else {
              _this.rotateCamera();
            }

        }

        if ( !_this.noZoom ) {

            if(para !== undefined && para._zoomFactor !== undefined) {
              _this.zoomCamera(para._zoomFactor, para.update);
            }
            else {
              _this.zoomCamera();
            }

        }

        if ( !_this.noPan ) {

            if(para !== undefined && para.mouseChange !== undefined) {
              _this.panCamera(para.mouseChange, para.update);
            }
            else {
              _this.panCamera();
            }

        }

        _this.object.position.addVectors( _this.target, _eye );

        _this.checkDistances();

        _this.object.lookAt( _this.target );

        if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

            _this.dispatchEvent( changeEvent );

            lastPosition.copy( _this.object.position );

        }

    };

    this.reset = function () {

        _this._state = _this.STATE.NONE;
        _prevState = _this.STATE.NONE;

        _this.target.copy( _this.target0 );
        _this.object.position.copy( _this.position0 );
        _this.object.up.copy( _this.up0 );

        _eye.subVectors( _this.object.position, _this.target );

        _this.object.lookAt( _this.target );

        _this.dispatchEvent( changeEvent );

        lastPosition.copy( _this.object.position );

    };

    // listeners

    function keydown( event ) {
//console.log("keydown");

        if ( _this.enabled === false ) return;

        window.removeEventListener( 'keydown', keydown );

        _prevState = _this._state;


        if ( _this._state !== _this.STATE.NONE ) {

            return;

        } else if ( event.keyCode === _this.keys[ _this.STATE.ROTATE ] &&  !_this.noRotate) {

            _this._state = _this.STATE.ROTATE;

        } else if ( (event.keyCode === _this.keys[ _this.STATE.ZOOM ]) && !_this.noZoom ) {

            _this._state = _this.STATE.ZOOM;

        } else if ( (event.keyCode === _this.keys[ _this.STATE.PAN ]) && !_this.noPan ) {

            _this._state = _this.STATE.PAN;

        }


    }

    function keyup( event ) {
//console.log("keyup");

        if ( _this.enabled === false ) return;

        _this._state = _prevState;

        window.addEventListener( 'keydown', keydown, false );

    }

    function mousedown( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _this._state === _this.STATE.NONE ) {

            _this._state = event.button;

        }

        if ( _this._state === _this.STATE.ROTATE && !_this.noRotate ) {

            _this._rotateStart.copy( getMouseProjectionOnBall( event.pageX, event.pageY ) );
            _this._rotateEnd.copy( _this._rotateStart );

        } else if ( _this._state === _this.STATE.ZOOM && !_this.noZoom ) {

            _this._zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _this._zoomEnd.copy(_this._zoomStart);

        } else if ( _this._state === _this.STATE.PAN && !_this.noPan ) {

            _this._panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _this._panEnd.copy(_this._panStart)

        }

        document.addEventListener( 'mousemove', mousemove, false );
        document.addEventListener( 'mouseup', mouseup, false );

        _this.dispatchEvent( startEvent );

    }

    function mousemove( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _this._state === _this.STATE.ROTATE && !_this.noRotate ) {

//console.log("ROTATE");
            _this._rotateEnd.copy( getMouseProjectionOnBall( event.pageX, event.pageY ) );

        } else if ( _this._state === _this.STATE.ZOOM && !_this.noZoom ) {

            _this._zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

        } else if ( _this._state === _this.STATE.PAN && !_this.noPan ) {

            _this._panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

        }

    }

    function mouseup( event ) {
        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        _this._state = _this.STATE.NONE;

        document.removeEventListener( 'mousemove', mousemove );
        document.removeEventListener( 'mouseup', mouseup );
        _this.dispatchEvent( endEvent );

    }

    function mousewheel( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }

        //_this._zoomStart.y += delta * 0.01;
        //_this._zoomStart.y = delta * 0.01;
        _this._zoomStart.y = delta * 0.005;
        _this.dispatchEvent( startEvent );
        _this.dispatchEvent( endEvent );

    }

    function touchstart( event ) {

        if ( _this.enabled === false ) return;

        switch ( event.touches.length ) {
            case 1:
                _this._state = _this.STATE.TOUCH_ROTATE;
                _this._rotateStart.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                _this._rotateEnd.copy( _this._rotateStart );
                break;

            case 2:
                _this._state = _this.STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panStart.copy( getMouseOnScreen( x, y ) );
                _this._panEnd.copy( _this._panStart );
                break;

            default:
                _this._state = _this.STATE.NONE;

        }
        _this.dispatchEvent( startEvent );


    }

    function touchmove( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1:
                _this._rotateEnd.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;

            case 2:
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panEnd.copy( getMouseOnScreen( x, y ) );
                break;

            default:
                _this._state = _this.STATE.NONE;

        }

    }

    function touchend( event ) {

        if ( _this.enabled === false ) return;

        switch ( event.touches.length ) {

            case 1:
                _this._rotateEnd.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                _this._rotateStart.copy( _this._rotateEnd );
                break;

            case 2:
                _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panEnd.copy( getMouseOnScreen( x, y ) );
                _this._panStart.copy( _this._panEnd );
                break;

        }

        _this._state = _this.STATE.NONE;
        _this.dispatchEvent( endEvent );

    }

    this.domElement.addEventListener( 'contextmn', function ( event ) { event.preventDefault(); }, false );

    this.domElement.addEventListener( 'mousedown', mousedown, false );

    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

    this.domElement.addEventListener( 'touchstart', touchstart, false );
    this.domElement.addEventListener( 'touchend', touchend, false );
    this.domElement.addEventListener( 'touchmove', touchmove, false );

    window.addEventListener( 'keydown', keydown, false );
    window.addEventListener( 'keyup', keyup, false );

    this.handleResize();

    // force an update at start
    this.update();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;

/*! OrthographicTrackballControls.js from http://threejs.org/
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 * @author Patrick Fuller / http://patrick-fuller.com
 * modified by Jiyao Wang
 */

THREE.OrthographicTrackballControls = function ( object, domElement, icn3d ) {

    var _this = this;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API
    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    // JW: the rotation speed of orthographic should be much less than that of perspective
    //this.rotateSpeed = 1.0;
    this.rotateSpeed = 0.5;
    this.zoomSpeed = 1.2;

    var zoomSpeedAdjust = 0.01;
    this.zoomSpeed *= zoomSpeedAdjust;

    //this.panSpeed = 0.3;
    this.panSpeed = 0.03;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    this._state = STATE.NONE;
    var _prevState = STATE.NONE;

    var _eye = new THREE.Vector3();

    this._rotateStart = new THREE.Vector3();
    this._rotateEnd = new THREE.Vector3();

    this._zoomStart = new THREE.Vector2();
    this._zoomEnd = new THREE.Vector2();
    var _zoomFactor = 1;

    var _touchZoomDistanceStart = 0;
    var _touchZoomDistanceEnd = 0;

    this._panStart = new THREE.Vector2();
    this._panEnd = new THREE.Vector2();

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    this.left0 = this.object.left;
    this.right0 = this.object.right;
    this.top0 = this.object.top;
    this.bottom0 = this.object.bottom;
    this.center0 = new THREE.Vector2((this.left0 + this.right0) / 2.0, (this.top0 + this.bottom0) / 2.0);

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start'};
    var endEvent = { type: 'end'};


    // methods

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;
        }

        this.left0 = this.object.left;
        this.right0 = this.object.right;
        this.top0 = this.object.top;
        this.bottom0 = this.object.bottom;
        this.center0.set((this.left0 + this.right0) / 2.0, (this.top0 + this.bottom0) / 2.0);

    };

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] === 'function' ) {

            this[ event.type ]( event );

        }

    };

    var getMouseOnScreen = ( function () {

        var vector = new THREE.Vector2();

        return function ( pageX, pageY ) {

            vector.set(
                ( pageX - _this.screen.left ) / _this.screen.width,
                ( pageY - _this.screen.top ) / _this.screen.height
            );

            return vector;

        };

    }() );

    var getMouseProjectionOnBall = ( function () {

        var vector = new THREE.Vector3();
        var objectUp = new THREE.Vector3();
        var mouseOnBall = new THREE.Vector3();

        return function ( pageX, pageY ) {

            mouseOnBall.set(
                ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
                ( _this.screen.height * 0.5 + _this.screen.top - pageY ) / (_this.screen.height*.5),
                0.0
            );

            var length = mouseOnBall.length();

            if ( _this.noRoll ) {

                if ( length < Math.SQRT1_2 ) {

                    mouseOnBall.z = Math.sqrt( 1.0 - length*length );

                } else {

                    mouseOnBall.z = .5 / length;

                }

            } else if ( length > 1.0 ) {

                mouseOnBall.normalize();

            } else {

                mouseOnBall.z = Math.sqrt( 1.0 - length * length );

            }

            _eye.copy( _this.object.position ).sub( _this.target );

            vector.copy( _this.object.up ).setLength( mouseOnBall.y )
            vector.add( objectUp.copy( _this.object.up ).cross( _eye ).setLength( mouseOnBall.x ) );
            vector.add( _eye.setLength( mouseOnBall.z ) );

            return vector;

        };

    }() );

    this.rotateCamera = (function(quaternionIn, bUpdate){

        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        return function (quaternionIn, bUpdate) {

            var angle;
            if(quaternionIn === undefined) {
              angle = Math.acos( _this._rotateStart.dot( _this._rotateEnd ) / _this._rotateStart.length() / _this._rotateEnd.length() );
            }

            //var angle = Math.acos( _this._rotateStart.dot( _this._rotateEnd ) / _this._rotateStart.length() / _this._rotateEnd.length() );

            if ( angle || quaternionIn !== undefined) {
                if(quaternionIn === undefined) {
                  axis.crossVectors( _this._rotateStart, _this._rotateEnd ).normalize();

                  angle *= _this.rotateSpeed;

                  quaternion.setFromAxisAngle( axis, -angle );
                }
                else {
                  quaternion.copy(quaternionIn);
                }

                // order matters in quaernion multiplication: http://www.cprogramming.com/tutorial/3d/quaternions.html
                if(bUpdate === undefined || bUpdate === true) icn3d.quaternion.multiplyQuaternions(quaternion, icn3d.quaternion);

                _eye.applyQuaternion( quaternion );
                _this.object.up.applyQuaternion( quaternion );

                _this._rotateEnd.applyQuaternion( quaternion );

                if ( _this.staticMoving ) {

                    _this._rotateStart.copy( _this._rotateEnd );

                } else {

                    quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
                    _this._rotateStart.applyQuaternion( quaternion );

                }

            }
        }

    }());

    this.zoomCamera = function (zoomFactor, bUpdate) {

        var factor;
        if ( _this._state === STATE.TOUCH_ZOOM_PAN ) {

            if(zoomFactor !== undefined) {
              factor = zoomFactor;
            }
            else {

              factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
              _touchZoomDistanceStart = _touchZoomDistanceEnd;
            }

        } else {

            if(zoomFactor !== undefined) {
              factor = zoomFactor;
            }
            else {

              factor = 1.0 + ( _this._zoomEnd.y - _this._zoomStart.y ) * _this.zoomSpeed / zoomSpeedAdjust;
            }
        }

        if(bUpdate === undefined || bUpdate === true) icn3d._zoomFactor *= factor;

        //if ( factor !== 1.0 && factor > 0.0 ) {
        if ( factor !== 1.0 ) {

            //_zoomFactor *= factor;
            _zoomFactor = factor;

            _this.object.left = _zoomFactor * _this.left0 + ( 1 - _zoomFactor ) *  _this.center0.x;
            _this.object.right = _zoomFactor * _this.right0 + ( 1 - _zoomFactor ) *  _this.center0.x;
            _this.object.top = _zoomFactor * _this.top0 + ( 1 - _zoomFactor ) *  _this.center0.y;
            _this.object.bottom = _zoomFactor * _this.bottom0 + ( 1 - _zoomFactor ) *  _this.center0.y;

            if ( _this.staticMoving ) {

                _this._zoomStart.copy( _this._zoomEnd );

            } else {

                _this._zoomStart.y += ( _this._zoomEnd.y - _this._zoomStart.y ) * this.dynamicDampingFactor;

            }

        }

    };

    this.panCamera = (function(mouseChangeIn, bUpdate){

        var mouseChange = new THREE.Vector2(),
            objectUp = new THREE.Vector3(),
            pan = new THREE.Vector3();

        return function (mouseChangeIn, bUpdate) {

            if(mouseChangeIn !== undefined) {
              mouseChange = mouseChangeIn;

              if(bUpdate === undefined || bUpdate === true) icn3d.mouseChange.add(mouseChangeIn);
            }
            else {
              mouseChange.copy( _this._panEnd ).sub( _this._panStart );

              if(bUpdate === undefined || bUpdate === true) icn3d.mouseChange.add( _this._panEnd ).sub( _this._panStart );
            }

            if ( mouseChange.lengthSq() ) {

                mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

                pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
                pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

                _this.object.position.add( pan );
                _this.target.add( pan );

                if ( _this.staticMoving ) {

                    _this._panStart.copy( _this._panEnd );

                } else {

                    _this._panStart.add( mouseChange.subVectors( _this._panEnd, _this._panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

                }

            }
        }

    }());

    this.update = function (para) {

        _eye.subVectors( _this.object.position, _this.target );

        if ( !_this.noRotate ) {

            if(para !== undefined && para.quaternion !== undefined) {
              _this.rotateCamera(para.quaternion, para.update);
            }
            else {
              _this.rotateCamera();
            }

        }

        if ( !_this.noZoom ) {

            if(para !== undefined && para._zoomFactor !== undefined) {
              _this.zoomCamera(para._zoomFactor, para.update);
            }
            else {
              _this.zoomCamera();
            }

            _this.object.updateProjectionMatrix();

        }

        if ( !_this.noPan ) {

            if(para !== undefined && para.mouseChange !== undefined) {
              _this.panCamera(para.mouseChange, para.update);
            }
            else {
              _this.panCamera();
            }

        }

        _this.object.position.addVectors( _this.target, _eye );

        _this.object.lookAt( _this.target );

        if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

            _this.dispatchEvent( changeEvent );

            lastPosition.copy( _this.object.position );

        }

    };

    this.reset = function () {

        _this._state = STATE.NONE;
        _prevState = STATE.NONE;

        _this.target.copy( _this.target0 );
        _this.object.position.copy( _this.position0 );
        _this.object.up.copy( _this.up0 );

        _eye.subVectors( _this.object.position, _this.target );

        _this.object.left = _this.left0;
        _this.object.right = _this.right0;
        _this.object.top = _this.top0;
        _this.object.bottom = _this.bottom0;

        _this.object.lookAt( _this.target );

        _this.dispatchEvent( changeEvent );

        lastPosition.copy( _this.object.position );

    };

    // listeners

    function keydown( event ) {

        if ( _this.enabled === false ) return;

        window.removeEventListener( 'keydown', keydown );

        _prevState = _this._state;

        if ( _this._state !== STATE.NONE ) {

            return;

        } else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

            _this._state = STATE.ROTATE;

        } else if ( (event.keyCode === _this.keys[ STATE.ZOOM ]) && !_this.noZoom ) {

            _this._state = STATE.ZOOM;

        } else if ( (event.keyCode === _this.keys[ STATE.PAN ]) && !_this.noPan ) {

            _this._state = STATE.PAN;

        }

    }

    function keyup( event ) {

        if ( _this.enabled === false ) return;

        _this._state = _prevState;

        window.addEventListener( 'keydown', keydown, false );

    }

    function mousedown( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _this._state === STATE.NONE ) {

            _this._state = event.button;

        }

        if ( _this._state === STATE.ROTATE && !_this.noRotate ) {

            _this._rotateStart.copy( getMouseProjectionOnBall( event.pageX, event.pageY ) );
            _this._rotateEnd.copy( _this._rotateStart );

        } else if ( _this._state === STATE.ZOOM && !_this.noZoom ) {

            _this._zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _this._zoomEnd.copy(_this._zoomStart);

        } else if ( _this._state === STATE.PAN && !_this.noPan ) {

            _this._panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _this._panEnd.copy(_this._panStart)

        }

        document.addEventListener( 'mousemove', mousemove, false );
        document.addEventListener( 'mouseup', mouseup, false );

        _this.dispatchEvent( startEvent );

    }

    function mousemove( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _this._state === STATE.ROTATE && !_this.noRotate ) {

            _this._rotateEnd.copy( getMouseProjectionOnBall( event.pageX, event.pageY ) );

        } else if ( _this._state === STATE.ZOOM && !_this.noZoom ) {

            _this._zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

        } else if ( _this._state === STATE.PAN && !_this.noPan ) {

            _this._panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

        }

    }

    function mouseup( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        _this._state = STATE.NONE;

        document.removeEventListener( 'mousemove', mousemove );
        document.removeEventListener( 'mouseup', mouseup );
        _this.dispatchEvent( endEvent );

    }

    function mousewheel( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }

        //_this._zoomStart.y += delta * 0.01;
        _this._zoomStart.y = delta * 0.01;
        _this.dispatchEvent( startEvent );
        _this.dispatchEvent( endEvent );

    }

    function touchstart( event ) {

        if ( _this.enabled === false ) return;

        switch ( event.touches.length ) {

            case 1:
                _this._state = STATE.TOUCH_ROTATE;
                _this._rotateStart.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                _this._rotateEnd.copy( _this._rotateStart );
                break;

            case 2:
                _this._state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panStart.copy( getMouseOnScreen( x, y ) );
                _this._panEnd.copy( _this._panStart );
                break;

            default:
                _this._state = STATE.NONE;

        }
        _this.dispatchEvent( startEvent );


    }

    function touchmove( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1:
                _this._rotateEnd.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;

            case 2:
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panEnd.copy( getMouseOnScreen( x, y ) );
                break;

            default:
                _this._state = STATE.NONE;

        }

    }

    function touchend( event ) {

        if ( _this.enabled === false ) return;

        switch ( event.touches.length ) {

            case 1:
                _this._rotateEnd.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                _this._rotateStart.copy( _this._rotateEnd );
                break;

            case 2:
                _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _this._panEnd.copy( getMouseOnScreen( x, y ) );
                _this._panStart.copy( _this._panEnd );
                break;

        }

        _this._state = STATE.NONE;
        _this.dispatchEvent( endEvent );

    }

    this.domElement.addEventListener( 'contextmn', function ( event ) { event.preventDefault(); }, false );

    this.domElement.addEventListener( 'mousedown', mousedown, false );

    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

    this.domElement.addEventListener( 'touchstart', touchstart, false );
    this.domElement.addEventListener( 'touchend', touchend, false );
    this.domElement.addEventListener( 'touchmove', touchmove, false );

    window.addEventListener( 'keydown', keydown, false );
    window.addEventListener( 'keyup', keyup, false );

    this.handleResize();

    // force an update at start
    this.update();

};

THREE.OrthographicTrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrthographicTrackballControls.prototype.constructor = THREE.OrthographicTrackballControls;

/*! Projector.js from http://threejs.org/
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.RenderableObject = function () {

    this.id = 0;

    this.object = null;
    this.z = 0;

};

//

THREE.RenderableFace = function () {

    this.id = 0;

    this.v1 = new THREE.RenderableVertex();
    this.v2 = new THREE.RenderableVertex();
    this.v3 = new THREE.RenderableVertex();

    this.normalModel = new THREE.Vector3();

    this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
    this.vertexNormalsLength = 0;

    this.color = new THREE.Color();
    this.material = null;
    this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ];

    this.z = 0;

};

//

THREE.RenderableVertex = function () {

    this.position = new THREE.Vector3();
    this.positionWorld = new THREE.Vector3();
    this.positionScreen = new THREE.Vector4();

    this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

    this.positionWorld.copy( vertex.positionWorld );
    this.positionScreen.copy( vertex.positionScreen );

};

//

THREE.RenderableLine = function () {

    this.id = 0;

    this.v1 = new THREE.RenderableVertex();
    this.v2 = new THREE.RenderableVertex();

    this.vertexColors = [ new THREE.Color(), new THREE.Color() ];
    this.material = null;

    this.z = 0;

};

//

THREE.RenderableSprite = function () {

    this.id = 0;

    this.object = null;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.rotation = 0;
    this.scale = new THREE.Vector2();

    this.material = null;

};

//

THREE.Projector = function () {

    var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
    _vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
    _face, _faceCount, _facePool = [], _facePoolLength = 0,
    _line, _lineCount, _linePool = [], _linePoolLength = 0,
    _sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

    _renderData = { objects: [], lights: [], elements: [] },

    _vA = new THREE.Vector3(),
    _vB = new THREE.Vector3(),
    _vC = new THREE.Vector3(),

    _vector3 = new THREE.Vector3(),
    _vector4 = new THREE.Vector4(),

    _clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
    _boundingBox = new THREE.Box3(),
    _pnts3 = new Array( 3 ),
    _pnts4 = new Array( 4 ),

    _viewMatrix = new THREE.Matrix4(),
    _viewProjectionMatrix = new THREE.Matrix4(),

    _modelMatrix,
    _modelViewProjectionMatrix = new THREE.Matrix4(),

    _normalMatrix = new THREE.Matrix3(),

    _frustum = new THREE.Frustum(),

    _clippedVertex1PositionScreen = new THREE.Vector4(),
    _clippedVertex2PositionScreen = new THREE.Vector4();

    //

    this.projectVector = function ( vector, camera ) {

        console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
        vector.project( camera );

    };

    this.unprojectVector = function ( vector, camera ) {

        console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
        vector.unproject( camera );

    };

    this.pkRay = function ( vector, camera ) {

        console.error( 'THREE.Projector: .pkRay() is now raycaster.setFromCamera().' );

    };

    //

    var RenderList = function () {

        var normals = [];
        var uvs = [];

        var object = null;
        var material = null;

        var normalMatrix = new THREE.Matrix3();

        var setObject = function ( value ) {

            object = value;
            material = object.material;

            normalMatrix.getNormalMatrix( object.matrixWorld );

            normals.length = 0;
            uvs.length = 0;

        };

        var projectVertex = function ( vertex ) {

            var position = vertex.position;
            var positionWorld = vertex.positionWorld;
            var positionScreen = vertex.positionScreen;

            positionWorld.copy( position ).applyMatrix4( _modelMatrix );
            positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

            var invW = 1 / positionScreen.w;

            positionScreen.x *= invW;
            positionScreen.y *= invW;
            positionScreen.z *= invW;

            vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
                     positionScreen.y >= - 1 && positionScreen.y <= 1 &&
                     positionScreen.z >= - 1 && positionScreen.z <= 1;

        };

        var pushVertex = function ( x, y, z ) {

            _vertex = getNextVertexInPool();
            _vertex.position.set( x, y, z );

            projectVertex( _vertex );

        };

        var pushNormal = function ( x, y, z ) {

            normals.push( x, y, z );

        };

        var pushUv = function ( x, y ) {

            uvs.push( x, y );

        };

        var checkTriangleVisibility = function ( v1, v2, v3 ) {

            if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

            _pnts3[ 0 ] = v1.positionScreen;
            _pnts3[ 1 ] = v2.positionScreen;
            _pnts3[ 2 ] = v3.positionScreen;

            return _clipBox.isIntersectionBox( _boundingBox.setFromPoints( _pnts3 ) );

        };

        var checkBackfaceCulling = function ( v1, v2, v3 ) {

            return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
                    ( v2.positionScreen.y - v1.positionScreen.y ) -
                    ( v3.positionScreen.y - v1.positionScreen.y ) *
                    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

        };

        var pushLine = function ( a, b ) {

            var v1 = _vertexPool[ a ];
            var v2 = _vertexPool[ b ];

            _line = getNextLineInPool();

            _line.id = object.id;
            _line.v1.copy( v1 );
            _line.v2.copy( v2 );
            _line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;

            _line.material = object.material;

            _renderData.elements.push( _line );

        };

        var pushTriangle = function ( a, b, c ) {

            var v1 = _vertexPool[ a ];
            var v2 = _vertexPool[ b ];
            var v3 = _vertexPool[ c ];

            if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

            if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

                _face = getNextFaceInPool();

                _face.id = object.id;
                _face.v1.copy( v1 );
                _face.v2.copy( v2 );
                _face.v3.copy( v3 );
                _face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

                for ( var i = 0; i < 3; i ++ ) {

                    var offset = arguments[ i ] * 3;
                    var normal = _face.vertexNormalsModel[ i ];

                    normal.set( normals[ offset ], normals[ offset + 1 ], normals[ offset + 2 ] );
                    normal.applyMatrix3( normalMatrix ).normalize();

                    var offset2 = arguments[ i ] * 2;

                    var uv = _face.uvs[ i ];
                    uv.set( uvs[ offset2 ], uvs[ offset2 + 1 ] );

                }

                _face.vertexNormalsLength = 3;

                _face.material = object.material;

                _renderData.elements.push( _face );

            }

        };

        return {
            setObject: setObject,
            projectVertex: projectVertex,
            checkTriangleVisibility: checkTriangleVisibility,
            checkBackfaceCulling: checkBackfaceCulling,
            pushVertex: pushVertex,
            pushNormal: pushNormal,
            pushUv: pushUv,
            pushLine: pushLine,
            pushTriangle: pushTriangle
        }

    };

    var renderList = new RenderList();

    this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

        _faceCount = 0;
        _lineCount = 0;
        _spriteCount = 0;

        _renderData.elements.length = 0;

        if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
        if ( camera.parent === undefined ) camera.updateMatrixWorld();

        _viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
        _viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

        _frustum.setFromMatrix( _viewProjectionMatrix );

        //

        _objectCount = 0;

        _renderData.objects.length = 0;
        _renderData.lights.length = 0;

        scene.traverseVisible( function ( object ) {

            if ( object instanceof THREE.Light ) {

                _renderData.lights.push( object );

            } else if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite ) {

                if ( object.material.visible === false ) return;

                if ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) {

                    _object = getNextObjectInPool();
                    _object.id = object.id;
                    _object.object = object;

                    _vector3.setFromMatrixPosition( object.matrixWorld );
                    _vector3.applyProjection( _viewProjectionMatrix );
                    _object.z = _vector3.z;

                    _renderData.objects.push( _object );

                }

            }

        } );

        if ( sortObjects === true ) {

            _renderData.objects.sort( painterSort );

        }

        //

        for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

            var object = _renderData.objects[ o ].object;
            var geometry = object.geometry;

            renderList.setObject( object );

            _modelMatrix = object.matrixWorld;

            _vertexCount = 0;

            if ( object instanceof THREE.Mesh ) {

                if ( geometry instanceof THREE.BufferGeometry ) {

                    var attributes = geometry.attributes;
                    var offsets = geometry.offsets;

                    if ( attributes.position === undefined ) continue;

                    var positions = attributes.position.array;

                    for ( var i = 0, l = positions.length; i < l; i += 3 ) {

                        renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

                    }

                    if ( attributes.normal !== undefined ) {

                        var normals = attributes.normal.array;

                        for ( var i = 0, l = normals.length; i < l; i += 3 ) {

                            renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

                        }

                    }

                    if ( attributes.uv !== undefined ) {

                        var uvs = attributes.uv.array;

                        for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

                            renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

                        }

                    }

                    if ( attributes.index !== undefined ) {

                        var indices = attributes.index.array;

                        if ( offsets.length > 0 ) {

                            for ( var o = 0; o < offsets.length; o ++ ) {

                                var offset = offsets[ o ];
                                var index = offset.index;

                                for ( var i = offset.start, l = offset.start + offset.count; i < l; i += 3 ) {

                                    renderList.pushTriangle( indices[ i ] + index, indices[ i + 1 ] + index, indices[ i + 2 ] + index );

                                }

                            }

                        } else {

                            for ( var i = 0, l = indices.length; i < l; i += 3 ) {

                                renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

                            }

                        }

                    } else {

                        for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

                            renderList.pushTriangle( i, i + 1, i + 2 );

                        }

                    }

                } else if ( geometry instanceof THREE.Geometry ) {

                    var vertices = geometry.vertices;
                    var faces = geometry.faces;
                    var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

                    _normalMatrix.getNormalMatrix( _modelMatrix );

                    var isFaceMaterial = object.material instanceof THREE.MeshFaceMaterial;
                    var objectMaterials = isFaceMaterial === true ? object.material : null;

                    for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

                        var vertex = vertices[ v ];
                        renderList.pushVertex( vertex.x, vertex.y, vertex.z );

                    }

                    for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

                        var face = faces[ f ];

                        var material = isFaceMaterial === true
                             ? objectMaterials.materials[ face.materialIndex ]
                             : object.material;

                        if ( material === undefined ) continue;

                        var side = material.side;

                        var v1 = _vertexPool[ face.a ];
                        var v2 = _vertexPool[ face.b ];
                        var v3 = _vertexPool[ face.c ];

                        if ( material.morphTargets === true ) {

                            var morphTargets = geometry.morphTargets;
                            var morphInfluences = object.morphTargetInfluences;

                            var v1p = v1.position;
                            var v2p = v2.position;
                            var v3p = v3.position;

                            _vA.set( 0, 0, 0 );
                            _vB.set( 0, 0, 0 );
                            _vC.set( 0, 0, 0 );

                            for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

                                var influence = morphInfluences[ t ];

                                if ( influence === 0 ) continue;

                                var targets = morphTargets[ t ].vertices;

                                _vA.x += ( targets[ face.a ].x - v1p.x ) * influence;
                                _vA.y += ( targets[ face.a ].y - v1p.y ) * influence;
                                _vA.z += ( targets[ face.a ].z - v1p.z ) * influence;

                                _vB.x += ( targets[ face.b ].x - v2p.x ) * influence;
                                _vB.y += ( targets[ face.b ].y - v2p.y ) * influence;
                                _vB.z += ( targets[ face.b ].z - v2p.z ) * influence;

                                _vC.x += ( targets[ face.c ].x - v3p.x ) * influence;
                                _vC.y += ( targets[ face.c ].y - v3p.y ) * influence;
                                _vC.z += ( targets[ face.c ].z - v3p.z ) * influence;

                            }

                            v1.position.add( _vA );
                            v2.position.add( _vB );
                            v3.position.add( _vC );

                            renderList.projectVertex( v1 );
                            renderList.projectVertex( v2 );
                            renderList.projectVertex( v3 );

                        }

                        if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

                        var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

                        if ( side !== THREE.DoubleSide ) {
                            if ( side === THREE.FrontSide && visible === false ) continue;
                            if ( side === THREE.BackSide && visible === true ) continue;
                        }

                        _face = getNextFaceInPool();

                        _face.id = object.id;
                        _face.v1.copy( v1 );
                        _face.v2.copy( v2 );
                        _face.v3.copy( v3 );

                        _face.normalModel.copy( face.normal );

                        if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

                            _face.normalModel.negate();

                        }

                        _face.normalModel.applyMatrix3( _normalMatrix ).normalize();

                        var faceVertexNormals = face.vertexNormals;

                        for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

                            var normalModel = _face.vertexNormalsModel[ n ];
                            normalModel.copy( faceVertexNormals[ n ] );

                            if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

                                normalModel.negate();

                            }

                            normalModel.applyMatrix3( _normalMatrix ).normalize();

                        }

                        _face.vertexNormalsLength = faceVertexNormals.length;

                        var vertexUvs = faceVertexUvs[ f ];

                        if ( vertexUvs !== undefined ) {

                            for ( var u = 0; u < 3; u ++ ) {

                                _face.uvs[ u ].copy( vertexUvs[ u ] );

                            }

                        }

                        _face.color = face.color;
                        _face.material = material;

                        _face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

                        _renderData.elements.push( _face );

                    }

                }

            } else if ( object instanceof THREE.Line ) {

                if ( geometry instanceof THREE.BufferGeometry ) {

                    var attributes = geometry.attributes;

                    if ( attributes.position !== undefined ) {

                        var positions = attributes.position.array;

                        for ( var i = 0, l = positions.length; i < l; i += 3 ) {

                            renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

                        }

                        if ( attributes.index !== undefined ) {

                            var indices = attributes.index.array;

                            for ( var i = 0, l = indices.length; i < l; i += 2 ) {

                                renderList.pushLine( indices[ i ], indices[ i + 1 ] );

                            }

                        } else {

                            var step = object.mode === THREE.LinePieces ? 2 : 1;

                            for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

                                renderList.pushLine( i, i + 1 );

                            }

                        }

                    }

                } else if ( geometry instanceof THREE.Geometry ) {

                    _modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

                    var vertices = object.geometry.vertices;

                    if ( vertices.length === 0 ) continue;

                    v1 = getNextVertexInPool();
                    v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

                    // Handle LineStrip and LinePieces
                    var step = object.mode === THREE.LinePieces ? 2 : 1;

                    for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

                        v1 = getNextVertexInPool();
                        v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

                        if ( ( v + 1 ) % step > 0 ) continue;

                        v2 = _vertexPool[ _vertexCount - 2 ];

                        _clippedVertex1PositionScreen.copy( v1.positionScreen );
                        _clippedVertex2PositionScreen.copy( v2.positionScreen );

                        if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

                            // Perform the perspective divide
                            _clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
                            _clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

                            _line = getNextLineInPool();

                            _line.id = object.id;
                            _line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
                            _line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

                            _line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

                            _line.material = object.material;

                            if ( object.material.vertexColors === THREE.VertexColors ) {

                                _line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
                                _line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

                            }

                            _renderData.elements.push( _line );

                        }

                    }

                }

            } else if ( object instanceof THREE.Sprite ) {

                _vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
                _vector4.applyMatrix4( _viewProjectionMatrix );

                var invW = 1 / _vector4.w;

                _vector4.z *= invW;

                if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

                    _sprite = getNextSpriteInPool();
                    _sprite.id = object.id;
                    _sprite.x = _vector4.x * invW;
                    _sprite.y = _vector4.y * invW;
                    _sprite.z = _vector4.z;
                    _sprite.object = object;

                    _sprite.rotation = object.rotation;

                    _sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
                    _sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

                    _sprite.material = object.material;

                    _renderData.elements.push( _sprite );

                }

            }

        }

        if ( sortElements === true ) {

            _renderData.elements.sort( painterSort );

        }

        return _renderData;

    };

    // Pools

    function getNextObjectInPool() {

        if ( _objectCount === _objectPoolLength ) {

            var object = new THREE.RenderableObject();
            _objectPool.push( object );
            _objectPoolLength ++;
            _objectCount ++;
            return object;

        }

        return _objectPool[ _objectCount ++ ];

    }

    function getNextVertexInPool() {

        if ( _vertexCount === _vertexPoolLength ) {

            var vertex = new THREE.RenderableVertex();
            _vertexPool.push( vertex );
            _vertexPoolLength ++;
            _vertexCount ++;
            return vertex;

        }

        return _vertexPool[ _vertexCount ++ ];

    }

    function getNextFaceInPool() {

        if ( _faceCount === _facePoolLength ) {

            var face = new THREE.RenderableFace();
            _facePool.push( face );
            _facePoolLength ++;
            _faceCount ++;
            return face;

        }

        return _facePool[ _faceCount ++ ];


    }

    function getNextLineInPool() {

        if ( _lineCount === _linePoolLength ) {

            var line = new THREE.RenderableLine();
            _linePool.push( line );
            _linePoolLength ++;
            _lineCount ++
            return line;

        }

        return _linePool[ _lineCount ++ ];

    }

    function getNextSpriteInPool() {

        if ( _spriteCount === _spritePoolLength ) {

            var sprite = new THREE.RenderableSprite();
            _spritePool.push( sprite );
            _spritePoolLength ++;
            _spriteCount ++
            return sprite;

        }

        return _spritePool[ _spriteCount ++ ];

    }

    //

    function painterSort( a, b ) {

        if ( a.z !== b.z ) {

            return b.z - a.z;

        } else if ( a.id !== b.id ) {

            return a.id - b.id;

        } else {

            return 0;

        }

    }

    function clipLine( s1, s2 ) {

        var alpha1 = 0, alpha2 = 1,

        // Calculate the boundary coordinate of each vertex for the near and far clip planes,
        // Z = -1 and Z = +1, respectively.
        bc1near =  s1.z + s1.w,
        bc2near =  s2.z + s2.w,
        bc1far =  - s1.z + s1.w,
        bc2far =  - s2.z + s2.w;

        if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

            // Both vertices lie entirely within all clip planes.
            return true;

        } else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

            // Both vertices lie entirely outside one of the clip planes.
            return false;

        } else {

            // The line segment spans at least one clip plane.

            if ( bc1near < 0 ) {

                // v1 lies outside the near plane, v2 inside
                alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

            } else if ( bc2near < 0 ) {

                // v2 lies outside the near plane, v1 inside
                alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

            }

            if ( bc1far < 0 ) {

                // v1 lies outside the far plane, v2 inside
                alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

            } else if ( bc2far < 0 ) {

                // v2 lies outside the far plane, v2 inside
                alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

            }

            if ( alpha2 < alpha1 ) {

                // The line segment spans two boundaries, but is outside both of them.
                // (This can't happen when we're only clipping against just near/far but good
                //  to leave the check here for future usage if other clip planes are added.)
                return false;

            } else {

                // Update the s1 and s2 vertices to match the clipped line segment.
                s1.lerp( s2, alpha1 );
                s2.lerp( s1, 1 - alpha2 );

                return true;

            }

        }

    }

};

!function(r,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(r.MMTF=r.MMTF||{})}(this,function(r){"use strict";function t(r,t,n){for(var e=(r.byteLength,0),i=n.length;i>e;e++){var o=n.charCodeAt(e);if(128>o)r.setUint8(t++,o>>>0&127|0);else if(2048>o)r.setUint8(t++,o>>>6&31|192),r.setUint8(t++,o>>>0&63|128);else if(65536>o)r.setUint8(t++,o>>>12&15|224),r.setUint8(t++,o>>>6&63|128),r.setUint8(t++,o>>>0&63|128);else{if(!(1114112>o))throw new Error("bad codepoint "+o);r.setUint8(t++,o>>>18&7|240),r.setUint8(t++,o>>>12&63|128),r.setUint8(t++,o>>>6&63|128),r.setUint8(t++,o>>>0&63|128)}}}function n(r){for(var t=0,n=0,e=r.length;e>n;n++){var i=r.charCodeAt(n);if(128>i)t+=1;else if(2048>i)t+=2;else if(65536>i)t+=3;else{if(!(1114112>i))throw new Error("bad codepoint "+i);t+=4}}return t}function e(r,i,o){var a=typeof r;if("string"===a){var u=n(r);if(32>u)return i.setUint8(o,160|u),t(i,o+1,r),1+u;if(256>u)return i.setUint8(o,217),i.setUint8(o+1,u),t(i,o+2,r),2+u;if(65536>u)return i.setUint8(o,218),i.setUint16(o+1,u),t(i,o+3,r),3+u;if(4294967296>u)return i.setUint8(o,219),i.setUint32(o+1,u),t(i,o+5,r),5+u}if(r instanceof Uint8Array){var u=r.byteLength,s=new Uint8Array(i.buffer);if(256>u)return i.setUint8(o,196),i.setUint8(o+1,u),s.set(r,o+2),2+u;if(65536>u)return i.setUint8(o,197),i.setUint16(o+1,u),s.set(r,o+3),3+u;if(4294967296>u)return i.setUint8(o,198),i.setUint32(o+1,u),s.set(r,o+5),5+u}if("number"===a){if(!isFinite(r))throw new Error("Number not finite: "+r);if(Math.floor(r)!==r)return i.setUint8(o,203),i.setFloat64(o+1,r),9;if(r>=0){if(128>r)return i.setUint8(o,r),1;if(256>r)return i.setUint8(o,204),i.setUint8(o+1,r),2;if(65536>r)return i.setUint8(o,205),i.setUint16(o+1,r),3;if(4294967296>r)return i.setUint8(o,206),i.setUint32(o+1,r),5;throw new Error("Number too big 0x"+r.toString(16))}if(r>=-32)return i.setInt8(o,r),1;if(r>=-128)return i.setUint8(o,208),i.setInt8(o+1,r),2;if(r>=-32768)return i.setUint8(o,209),i.setInt16(o+1,r),3;if(r>=-2147483648)return i.setUint8(o,210),i.setInt32(o+1,r),5;throw new Error("Number too small -0x"+(-r).toString(16).substr(1))}if(null===r)return i.setUint8(o,192),1;if("boolean"===a)return i.setUint8(o,r?195:194),1;if("object"===a){var u,f=0,c=Array.isArray(r);if(c)u=r.length;else{var d=Object.keys(r);u=d.length}var f;if(16>u?(i.setUint8(o,u|(c?144:128)),f=1):65536>u?(i.setUint8(o,c?220:222),i.setUint16(o+1,u),f=3):4294967296>u&&(i.setUint8(o,c?221:223),i.setUint32(o+1,u),f=5),c)for(var l=0;u>l;l++)f+=e(r[l],i,o+f);else for(var l=0;u>l;l++){var g=d[l];f+=e(g,i,o+f),f+=e(r[g],i,o+f)}return f}throw new Error("Unknown type "+a)}function i(r){var t=typeof r;if("string"===t){var e=n(r);if(32>e)return 1+e;if(256>e)return 2+e;if(65536>e)return 3+e;if(4294967296>e)return 5+e}if(r instanceof Uint8Array){var e=r.byteLength;if(256>e)return 2+e;if(65536>e)return 3+e;if(4294967296>e)return 5+e}if("number"===t){if(Math.floor(r)!==r)return 9;if(r>=0){if(128>r)return 1;if(256>r)return 2;if(65536>r)return 3;if(4294967296>r)return 5;throw new Error("Number too big 0x"+r.toString(16))}if(r>=-32)return 1;if(r>=-128)return 2;if(r>=-32768)return 3;if(r>=-2147483648)return 5;throw new Error("Number too small -0x"+r.toString(16).substr(1))}if("boolean"===t||null===r)return 1;if("object"===t){var e,o=0;if(Array.isArray(r)){e=r.length;for(var a=0;e>a;a++)o+=i(r[a])}else{var u=Object.keys(r);e=u.length;for(var a=0;e>a;a++){var s=u[a];o+=i(s)+i(r[s])}}if(16>e)return 1+o;if(65536>e)return 3+o;if(4294967296>e)return 5+o;throw new Error("Array or object too long 0x"+e.toString(16))}throw new Error("Unknown type "+t)}function o(r){var t=new ArrayBuffer(i(r)),n=new DataView(t);return e(r,n,0),new Uint8Array(t)}function a(r,t,n){return t?new r(t.buffer,t.byteOffset,t.byteLength/(n||1)):void 0}function u(r){return a(DataView,r)}function s(r){return a(Uint8Array,r)}function f(r){return a(Int8Array,r)}function c(r){return a(Int32Array,r,4)}function d(r){return a(Float32Array,r,4)}function l(r,t){var n=r.length/2;t||(t=new Int16Array(n));for(var e=0,i=0;n>e;++e,i+=2)t[e]=r[i]<<8^r[i+1]<<0;return t}function g(r,t){var n=r.length;t||(t=new Uint8Array(2*n));for(var e=u(t),i=0;n>i;++i)e.setInt16(2*i,r[i]);return s(t)}function v(r,t){var n=r.length/4;t||(t=new Int32Array(n));for(var e=0,i=0;n>e;++e,i+=4)t[e]=r[i]<<24^r[i+1]<<16^r[i+2]<<8^r[i+3]<<0;return t}function L(r,t){var n=r.length;t||(t=new Uint8Array(4*n));for(var e=u(t),i=0;n>i;++i)e.setInt32(4*i,r[i]);return s(t)}function h(r,t){var n=r.length;t||(t=new Float32Array(n/4));for(var e=u(t),i=u(r),o=0,a=0,s=n/4;s>o;++o,a+=4)e.setFloat32(a,i.getFloat32(a),!0);return t}function y(r,t,n){var e=r.length,i=1/t;n||(n=new Float32Array(e));for(var o=0;e>o;++o)n[o]=r[o]*i;return n}function m(r,t,n){var e=r.length;n||(n=new Int32Array(e));for(var i=0;e>i;++i)n[i]=Math.round(r[i]*t);return n}function p(r,t){var n,e;if(!t){var i=0;for(n=0,e=r.length;e>n;n+=2)i+=r[n+1];t=new r.constructor(i)}var o=0;for(n=0,e=r.length;e>n;n+=2)for(var a=r[n],u=r[n+1],s=0;u>s;++s)t[o]=a,++o;return t}function U(r){if(0===r.length)return new Int32Array;var t,n,e=2;for(t=1,n=r.length;n>t;++t)r[t-1]!==r[t]&&(e+=2);var i=new Int32Array(e),o=0,a=1;for(t=1,n=r.length;n>t;++t)r[t-1]!==r[t]?(i[o]=r[t-1],i[o+1]=a,a=1,o+=2):++a;return i[o]=r[r.length-1],i[o+1]=a,i}function b(r,t){var n=r.length;t||(t=new r.constructor(n)),n&&(t[0]=r[0]);for(var e=1;n>e;++e)t[e]=r[e]+t[e-1];return t}function I(r,t){var n=r.length;t||(t=new r.constructor(n)),t[0]=r[0];for(var e=1;n>e;++e)t[e]=r[e]-r[e-1];return t}function w(r,t){var n,e,i=r instanceof Int8Array?127:32767,o=-i-1,a=r.length;if(!t){var u=0;for(n=0;a>n;++n)r[n]<i&&r[n]>o&&++u;t=new Int32Array(u)}for(n=0,e=0;a>n;){for(var s=0;r[n]===i||r[n]===o;)s+=r[n],++n;s+=r[n],++n,t[e]=s,++e}return t}function C(r,t){var n,e=t?127:32767,i=-e-1,o=r.length,a=0;for(n=0;o>n;++n){var u=r[n];0===u?++a:u>0?(a+=Math.ceil(u/e),u%e===0&&(a+=1)):(a+=Math.ceil(u/i),u%i===0&&(a+=1))}var s=t?new Int8Array(a):new Int16Array(a),f=0;for(n=0;o>n;++n){var u=r[n];if(u>=0)for(;u>=e;)s[f]=e,++f,u-=e;else for(;i>=u;)s[f]=i,++f,u-=i;s[f]=u,++f}return s}function A(r,t){return b(p(r),t)}function x(r){return U(I(r))}function M(r,t,n){return y(p(r,c(n)),t,n)}function F(r,t){return U(m(r,t))}function S(r,t,n){return y(b(r,c(n)),t,n)}function E(r,t,n){return I(m(r,t),n)}function N(r,t,n){return y(w(r,c(n)),t,n)}function O(r,t,n){var e=w(r,c(n));return S(e,t,d(e))}function T(r,t,n){return C(E(r,t),n)}function k(r){var t=u(r),n=t.getInt32(0),e=t.getInt32(4),i=r.subarray(8,12),r=r.subarray(12);return[n,r,e,i]}function j(r,t,n,e){var i=new ArrayBuffer(12+e.byteLength),o=new Uint8Array(i),a=new DataView(i);return a.setInt32(0,r),a.setInt32(4,t),n&&o.set(n,8),o.set(e,12),o}function q(r){var t=r.length,n=s(r);return j(2,t,void 0,n)}function D(r){var t=r.length,n=L(r);return j(4,t,void 0,n)}function P(r,t){var n=r.length/t,e=L([t]),i=s(r);return j(5,n,e,i)}function z(r){var t=r.length,n=L(U(r));return j(6,t,void 0,n)}function B(r){var t=r.length,n=L(x(r));return j(8,t,void 0,n)}function V(r,t){var n=r.length,e=L([t]),i=L(F(r,t));return j(9,n,e,i)}function G(r,t){var n=r.length,e=L([t]),i=g(T(r,t));return j(10,n,e,i)}function R(r){var t={};return rr.forEach(function(n){void 0!==r[n]&&(t[n]=r[n])}),r.bondAtomList&&(t.bondAtomList=D(r.bondAtomList)),r.bondOrderList&&(t.bondOrderList=q(r.bondOrderList)),t.xCoordList=G(r.xCoordList,1e3),t.yCoordList=G(r.yCoordList,1e3),t.zCoordList=G(r.zCoordList,1e3),r.bFactorList&&(t.bFactorList=G(r.bFactorList,100)),r.atomIdList&&(t.atomIdList=B(r.atomIdList)),r.altLocList&&(t.altLocList=z(r.altLocList)),r.occupancyList&&(t.occupancyList=V(r.occupancyList,100)),t.groupIdList=B(r.groupIdList),t.groupTypeList=D(r.groupTypeList),r.secStructList&&(t.secStructList=q(r.secStructList)),r.insCodeList&&(t.insCodeList=z(r.insCodeList)),r.sequenceIndexList&&(t.sequenceIndexList=B(r.sequenceIndexList)),t.chainIdList=P(r.chainIdList,4),r.chainNameList&&(t.chainNameList=P(r.chainNameList,4)),t}function H(r){function t(r){for(var t={},n=0;r>n;n++){var e=o();t[e]=o()}return t}function n(t){var n=r.subarray(a,a+t);return a+=t,n}function e(t){var n=r.subarray(a,a+t);a+=t;var e=65535;if(t>e){for(var i=[],o=0;o<n.length;o+=e)i.push(String.fromCharCode.apply(null,n.subarray(o,o+e)));return i.join("")}return String.fromCharCode.apply(null,n)}function i(r){for(var t=new Array(r),n=0;r>n;n++)t[n]=o();return t}function o(){var o,s,f=r[a];if(0===(128&f))return a++,f;if(128===(240&f))return s=15&f,a++,t(s);if(144===(240&f))return s=15&f,a++,i(s);if(160===(224&f))return s=31&f,a++,e(s);if(224===(224&f))return o=u.getInt8(a),a++,o;switch(f){case 192:return a++,null;case 194:return a++,!1;case 195:return a++,!0;case 196:return s=u.getUint8(a+1),a+=2,n(s);case 197:return s=u.getUint16(a+1),a+=3,n(s);case 198:return s=u.getUint32(a+1),a+=5,n(s);case 202:return o=u.getFloat32(a+1),a+=5,o;case 203:return o=u.getFloat64(a+1),a+=9,o;case 204:return o=r[a+1],a+=2,o;case 205:return o=u.getUint16(a+1),a+=3,o;case 206:return o=u.getUint32(a+1),a+=5,o;case 208:return o=u.getInt8(a+1),a+=2,o;case 209:return o=u.getInt16(a+1),a+=3,o;case 210:return o=u.getInt32(a+1),a+=5,o;case 217:return s=u.getUint8(a+1),a+=2,e(s);case 218:return s=u.getUint16(a+1),a+=3,e(s);case 219:return s=u.getUint32(a+1),a+=5,e(s);case 220:return s=u.getUint16(a+1),a+=3,i(s);case 221:return s=u.getUint32(a+1),a+=5,i(s);case 222:return s=u.getUint16(a+1),a+=3,t(s);case 223:return s=u.getUint32(a+1),a+=5,t(s)}throw new Error("Unknown type 0x"+f.toString(16))}var a=0,u=new DataView(r.buffer);return o()}function W(r,t,n,e){switch(r){case 1:return h(t);case 2:return f(t);case 3:return l(t);case 4:return v(t);case 5:return s(t);case 6:return p(v(t),new Uint8Array(n));case 7:return p(v(t));case 8:return A(v(t));case 9:return M(v(t),v(e)[0]);case 10:return O(l(t),v(e)[0]);case 11:return y(l(t),v(e)[0]);case 12:return N(l(t),v(e)[0]);case 13:return N(f(t),v(e)[0]);case 14:return w(l(t));case 15:return w(f(t))}}function X(r,t){t=t||{};var n=t.ignoreFields,e={};return nr.forEach(function(t){var i=n?-1!==n.indexOf(t):!1,o=r[t];i||void 0===o||(o instanceof Uint8Array?e[t]=W.apply(null,k(o)):e[t]=o)}),e}function J(r){return String.fromCharCode.apply(null,r).replace(/\0/g,"")}function K(r,t,n){n=n||{};var e,i,o,a,u,s,f=n.firstModelOnly,c=t.onModel,d=t.onChain,l=t.onGroup,g=t.onAtom,v=t.onBond,L=0,h=0,y=0,m=0,p=0,U=-1,b=r.chainNameList,I=r.secStructList,w=r.insCodeList,C=r.sequenceIndexList,A=r.atomIdList,x=r.bFactorList,M=r.altLocList,F=r.occupancyList,S=r.bondAtomList,E=r.bondOrderList;for(e=0,i=r.chainsPerModel.length;i>e&&!(f&&L>0);++e){var N=r.chainsPerModel[L];for(c&&c({chainCount:N,modelIndex:L}),o=0;N>o;++o){var O=r.groupsPerChain[h];if(d){var T=J(r.chainIdList.subarray(4*h,4*h+4)),k=null;b&&(k=J(b.subarray(4*h,4*h+4))),d({groupCount:O,chainIndex:h,modelIndex:L,chainId:T,chainName:k})}for(a=0;O>a;++a){var j=r.groupList[r.groupTypeList[y]],q=j.atomNameList.length;if(l){var D=null;I&&(D=I[y]);var P=null;r.insCodeList&&(P=String.fromCharCode(w[y]));var z=null;C&&(z=C[y]),l({atomCount:q,groupIndex:y,chainIndex:h,modelIndex:L,groupId:r.groupIdList[y],groupType:r.groupTypeList[y],groupName:j.groupName,singleLetterCode:j.singleLetterCode,chemCompType:j.chemCompType,secStruct:D,insCode:P,sequenceIndex:z})}for(u=0;q>u;++u){if(g){var B=null;A&&(B=A[m]);var V=null;x&&(V=x[m]);var G=null;M&&(G=String.fromCharCode(M[m]));var R=null;F&&(R=F[m]),g({atomIndex:m,groupIndex:y,chainIndex:h,modelIndex:L,atomId:B,element:j.elementList[u],atomName:j.atomNameList[u],formalCharge:j.formalChargeList[u],xCoord:r.xCoordList[m],yCoord:r.yCoordList[m],zCoord:r.zCoordList[m],bFactor:V,altLoc:G,occupancy:R})}m+=1}if(v){var H=j.bondAtomList;for(u=0,s=j.bondOrderList.length;s>u;++u)v({atomIndex1:m-q+H[2*u],atomIndex2:m-q+H[2*u+1],bondOrder:j.bondOrderList[u]})}y+=1}h+=1}if(p=U+1,U=m-1,v&&S)for(u=0,s=S.length;s>u;u+=2){var W=S[u],X=S[u+1];(W>=p&&U>=W||X>=p&&U>=X)&&v({atomIndex1:W,atomIndex2:X,bondOrder:E?E[u/2]:null})}L+=1}}function Q(r){return o(R(r))}function Y(r,t){r instanceof ArrayBuffer&&(r=new Uint8Array(r));var n;return n=r instanceof Uint8Array?H(r):r,X(n,t)}function Z(r,t,n,e){function i(){try{var r=Y(o.response);n(r)}catch(t){e(t)}}var o=new XMLHttpRequest;o.addEventListener("load",i,!0),o.addEventListener("error",e,!0),o.responseType="arraybuffer",o.open("GET",t+r.toUpperCase()),o.send()}function $(r,t,n){Z(r,or,t,n)}function _(r,t,n){Z(r,ar,t,n)}var rr=["mmtfVersion","mmtfProducer","unitCell","spaceGroup","structureId","title","depositionDate","releaseDate","experimentalMethods","resolution","rFree","rWork","bioAssemblyList","ncsOperatorList","entityList","groupList","numBonds","numAtoms","numGroups","numChains","numModels","groupsPerChain","chainsPerModel"],tr=["xCoordList","yCoordList","zCoordList","groupIdList","groupTypeList","chainIdList","bFactorList","atomIdList","altLocList","occupancyList","secStructList","insCodeList","sequenceIndexList","chainNameList","bondAtomList","bondOrderList"],nr=rr.concat(tr),er="v1.0.1",ir="//mmtf.rcsb.org/v1.0/",or=ir+"full/",ar=ir+"reduced/";r.encode=Q,r.decode=Y,r.traverse=K,r.fetch=$,r.fetchReduced=_,r.version=er,r.fetchUrl=or,r.fetchReducedUrl=ar,r.encodeMsgpack=o,r.encodeMmtf=R,r.decodeMsgpack=H,r.decodeMmtf=X});
var $NGL_shaderTextHash = {};

$NGL_shaderTextHash['SphereImpostor.frag'] = ["#define STANDARD",
"#define IMPOSTOR",
"",
"uniform vec3 diffuse;",
"uniform vec3 emissive;",
"uniform float roughness;",
"uniform float metalness;",
"uniform float opacity;",
"uniform float nearClip;",
"uniform mat4 projectionMatrix;",
"uniform float ortho;",
"",
"varying float vRadius;",
"varying float vRadiusSq;",
"varying vec3 vPoint;",
"varying vec3 vPointViewPosition;",
"",
"#ifdef PICKING",
"    uniform float objectId;",
"    varying vec3 vPickingColor;",
"#else",
"    #include common",
"    #include color_pars_fragment",
"    #include fog_pars_fragment",
"    #include bsdfs",
"    #include lights_pars_begin",
"    #include lights_physical_pars_fragment",
"#endif",
"",
"bool flag2 = false;",
"bool interior = false;",
"vec3 cameraPos;",
"vec3 cameraNormal;",
"",
"// Calculate depth based on the given camera position.",
"float calcDepth( in vec3 cameraPos ){",
"    vec2 clipZW = cameraPos.z * projectionMatrix[2].zw + projectionMatrix[3].zw;",
"    return 0.5 + 0.5 * clipZW.x / clipZW.y;",
"}",
"",
"float calcClip( vec3 cameraPos ){",
"    return dot( vec4( cameraPos, 1.0 ), vec4( 0.0, 0.0, 1.0, nearClip - 0.5 ) );",
"}",
"",
"bool Impostor( out vec3 cameraPos, out vec3 cameraNormal ){",
"",
"    vec3 cameraSpherePos = -vPointViewPosition;",
"    cameraSpherePos.z += vRadius;",
"",
"    vec3 rayOrigin = mix( vec3( 0.0, 0.0, 0.0 ), vPoint, ortho );",
"    vec3 rayDirection = mix( normalize( vPoint ), vec3( 0.0, 0.0, 1.0 ), ortho );",
"    vec3 cameraSphereDir = mix( cameraSpherePos, rayOrigin - cameraSpherePos, ortho );",
"",
"    float B = dot( rayDirection, cameraSphereDir );",
"    float det = B * B + vRadiusSq - dot( cameraSphereDir, cameraSphereDir );",
"",
"    if( det < 0.0 ){",
"        discard;",
"        return false;",
"    }",
"        float sqrtDet = sqrt( det );",
"        float posT = mix( B + sqrtDet, B + sqrtDet, ortho );",
"        float negT = mix( B - sqrtDet, sqrtDet - B, ortho );",
"",
"        cameraPos = rayDirection * negT + rayOrigin;",
"",
"        #ifdef NEAR_CLIP",
"if( calcDepth( cameraPos ) <= 0.0 ){",
"    cameraPos = rayDirection * posT + rayOrigin;",
"    interior = true;",
"    return false;",
"}else if( calcClip( cameraPos ) > 0.0 ){",
"    cameraPos = rayDirection * posT + rayOrigin;",
"    interior = true;",
"    flag2 = true;",
"    return false;",
"}else{",
"    cameraNormal = normalize( cameraPos - cameraSpherePos );",
"}",
"        #else",
"if( calcDepth( cameraPos ) <= 0.0 ){",
"    cameraPos = rayDirection * posT + rayOrigin;",
"    interior = true;",
"    return false;",
"}else{",
"    cameraNormal = normalize( cameraPos - cameraSpherePos );",
"}",
"        #endif",
"",
"        cameraNormal = normalize( cameraPos - cameraSpherePos );",
"        cameraNormal *= float(!interior) * 2.0 - 1.0;",
"         return !interior;",
"",
"}",
"",
"void main(void){",
"",
"    bool flag = Impostor( cameraPos, cameraNormal );",
"",
"    #ifdef NEAR_CLIP",
"        if( calcClip( cameraPos ) > 0.0 )",
"            discard;",
"    #endif",
"",
"    // FIXME not compatible with custom clipping plane",
"    //Set the depth based on the new cameraPos.",
"    gl_FragDepthEXT = calcDepth( cameraPos );",
"    if( !flag ){",
"",
"        // clamp to near clipping plane and add a tiny value to",
"        // make spheres with a greater radius occlude smaller ones",
"        #ifdef NEAR_CLIP",
"if( flag2 ){",
"    gl_FragDepthEXT = max( 0.0, calcDepth( vec3( - ( nearClip - 0.5 ) ) ) + ( 0.0000001 / vRadius ) );",
"}else if( gl_FragDepthEXT >= 0.0 ){",
"    gl_FragDepthEXT = 0.0 + ( 0.0000001 / vRadius );",
"}",
"        #else",
"if( gl_FragDepthEXT >= 0.0 ){",
"    gl_FragDepthEXT = 0.0 + ( 0.0000001 / vRadius );",
"}",
"        #endif",
"",
"    }",
"",
"    // bugfix (mac only?)",
"    if (gl_FragDepthEXT < 0.0)",
"        discard;",
"    if (gl_FragDepthEXT > 1.0)",
"        discard;",
"",
"    #ifdef PICKING",
"",
"        gl_FragColor = vec4( vPickingColor, objectId );",
"",
"    #else",
"",
"        vec3 vNormal = cameraNormal;",
"        vec3 vViewPosition = -cameraPos;",
"",
"        vec4 diffuseColor = vec4( diffuse, opacity );",
"        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
"        vec3 totalEmissiveLight = emissive;",
"",
"        #include color_fragment",
"        #include roughnessmap_fragment",
"        #include metalnessmap_fragment",
"",
"        // don't use include normal_fragment",
"        vec3 normal = normalize( vNormal );",
"",
"        #include lights_physical_fragment",
"        //include lights_template",
"        #include lights_fragment_begin",
"        #include lights_fragment_end",
"",
"        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveLight;",
"",
"        gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
"        //gl_FragColor = vec4( reflectedLight.directSpecular, diffuseColor.a );",
"",
"        #include premultiplied_alpha_fragment",
"        #include tonemapping_fragment",
"        #include encodings_fragment",
"        #include fog_fragment",
"",
"    #endif",
"",
"}"
].join("\n");

$NGL_shaderTextHash['SphereImpostor.vert'] = ["uniform mat4 projectionMatrixInverse;",
"uniform float nearClip;",
"",
"varying float vRadius;",
"varying float vRadiusSq;",
"varying vec3 vPoint;",
"varying vec3 vPointViewPosition;",
"varying float fogDepth;",
"",
"attribute vec2 mapping;",
"//attribute vec3 position;",
"attribute float radius;",
"",
"#ifdef PICKING",
"    #include unpack_clr",
"    attribute float primitiveId;",
"    varying vec3 vPickingColor;",
"#else",
"    #include color_pars_vertex",
"#endif",
"",
"//include matrix_scale",
"float matrixScale( in mat4 m ){",
"    vec4 r = m[ 0 ];",
"    return sqrt( r[ 0 ] * r[ 0 ] + r[ 1 ] * r[ 1 ] + r[ 2 ] * r[ 2 ] );",
"}",
"",
"const mat4 D = mat4(",
"    1.0, 0.0, 0.0, 0.0,",
"    0.0, 1.0, 0.0, 0.0,",
"    0.0, 0.0, 1.0, 0.0,",
"    0.0, 0.0, 0.0, -1.0",
");",
"",
"mat4 transpose( in mat4 inMatrix ) {",
"    vec4 i0 = inMatrix[0];",
"    vec4 i1 = inMatrix[1];",
"    vec4 i2 = inMatrix[2];",
"    vec4 i3 = inMatrix[3];",
"",
"    mat4 outMatrix = mat4(",
"        vec4(i0.x, i1.x, i2.x, i3.x),",
"        vec4(i0.y, i1.y, i2.y, i3.y),",
"        vec4(i0.z, i1.z, i2.z, i3.z),",
"        vec4(i0.w, i1.w, i2.w, i3.w)",
"    );",
"    return outMatrix;",
"}",
"",
"//------------------------------------------------------------------------------",
"// Compute point size and center using the technique described in:",
"// 'GPU-Based Ray-Casting of Quadratic Surfaces'",
"// by Christian Sigg, Tim Weyrich, Mario Botsch, Markus Gross.",
"//",
"// Code based on",
"/*=========================================================================",
"",
" Program:   Visualization Toolkit",
" Module:    Quadrics_fs.glsl and Quadrics_vs.glsl",
"",
" Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen",
" All rights reserved.",
" See Copyright.txt or http://www.kitware.com/Copyright.htm for details.",
"",
" This software is distributed WITHOUT ANY WARRANTY; without even",
" the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR",
" PURPOSE.  See the above copyright notice for more information.",
"",
" =========================================================================*/",
"",
"// .NAME Quadrics_fs.glsl and Quadrics_vs.glsl",
"// .SECTION Thanks",
"// <verbatim>",
"//",
"//  This file is part of the PointSprites plugin developed and contributed by",
"//",
"//  Copyright (c) CSCS - Swiss National Supercomputing Centre",
"//                EDF - Electricite de France",
"//",
"//  John Biddiscombe, Ugo Varetto (CSCS)",
"//  Stephane Ploix (EDF)",
"//",
"// </verbatim>",
"//",
"// Contributions by Alexander Rose",
"// - ported to WebGL",
"// - adapted to work with quads",
"void ComputePointSizeAndPositionInClipCoordSphere(){",
"",
"    vec2 xbc;",
"    vec2 ybc;",
"",
"    mat4 T = mat4(",
"        radius, 0.0, 0.0, 0.0,",
"        0.0, radius, 0.0, 0.0,",
"        0.0, 0.0, radius, 0.0,",
"        position.x, position.y, position.z, 1.0",
"    );",
"",
"    mat4 R = transpose( projectionMatrix * modelViewMatrix * T );",
"    float A = dot( R[ 3 ], D * R[ 3 ] );",
"    float B = -2.0 * dot( R[ 0 ], D * R[ 3 ] );",
"    float C = dot( R[ 0 ], D * R[ 0 ] );",
"    xbc[ 0 ] = ( -B - sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    xbc[ 1 ] = ( -B + sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    float sx = abs( xbc[ 0 ] - xbc[ 1 ] ) * 0.5;",
"",
"    A = dot( R[ 3 ], D * R[ 3 ] );",
"    B = -2.0 * dot( R[ 1 ], D * R[ 3 ] );",
"    C = dot( R[ 1 ], D * R[ 1 ] );",
"    ybc[ 0 ] = ( -B - sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    ybc[ 1 ] = ( -B + sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    float sy = abs( ybc[ 0 ] - ybc[ 1 ]  ) * 0.5;",
"",
"    gl_Position.xy = vec2( 0.5 * ( xbc.x + xbc.y ), 0.5 * ( ybc.x + ybc.y ) );",
"    gl_Position.xy -= mapping * vec2( sx, sy );",
"    gl_Position.xy *= gl_Position.w;",
"",
"}",
"",
"void main(void){",
"",
"    #ifdef PICKING",
"        vPickingColor = unpackColor( primitiveId );",
"    #else",
"        #include color_vertex",
"    #endif",
"",
"    vRadius = radius * matrixScale( modelViewMatrix );",
"",
"    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
"    // avoid clipping, added again in fragment shader",
"    mvPosition.z -= vRadius;",
"",
"    gl_Position = projectionMatrix * vec4( mvPosition.xyz, 1.0 );",
"    ComputePointSizeAndPositionInClipCoordSphere();",
"",
"",
"    vRadiusSq = vRadius * vRadius;",
"    vec4 vPoint4 = projectionMatrixInverse * gl_Position;",
"    vPoint = vPoint4.xyz / vPoint4.w;",
"    vPointViewPosition = -mvPosition.xyz / mvPosition.w;",
"",
"}"
].join("\n");

$NGL_shaderTextHash['CylinderImpostor.frag'] = ["#define STANDARD",
"#define IMPOSTOR",
"",
"// Open-Source PyMOL is Copyright (C) Schrodinger, LLC.",
"//",
"//  All Rights Reserved",
"//",
"//  Permission to use, copy, modify, distribute, and distribute modified",
"//  versions of this software and its built-in documentation for any",
"//  purpose and without fee is hereby granted, provided that the above",
"//  copyright notice appears in all copies and that both the copyright",
"//  notice and this permission notice appear in supporting documentation,",
"//  and that the name of Schrodinger, LLC not be used in advertising or",
"//  publicity pertaining to distribution of the software without specific,",
"//  written prior permission.",
"//",
"//  SCHRODINGER, LLC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,",
"//  INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN",
"//  NO EVENT SHALL SCHRODINGER, LLC BE LIABLE FOR ANY SPECIAL, INDIRECT OR",
"//  CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS",
"//  OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE",
"//  OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE",
"//  USE OR PERFORMANCE OF THIS SOFTWARE.",
"",
"// Contributions by Alexander Rose",
"// - ported to WebGL",
"// - dual color",
"// - pk color",
"// - custom clipping",
"// - three.js lighting",
"",
"uniform vec3 diffuse;",
"uniform vec3 emissive;",
"uniform float roughness;",
"uniform float metalness;",
"uniform float opacity;",
"uniform float nearClip;",
"uniform mat4 projectionMatrix;",
"uniform float ortho;",
"",
"varying vec3 axis;",
"varying vec4 base_radius;",
"varying vec4 end_b;",
"varying vec3 U;",
"varying vec3 V;",
"varying vec4 w;",
"",
"#ifdef PICKING",
"    uniform float objectId;",
"    varying vec3 vPickingColor;",
"#else",
"    varying vec3 vColor1;",
"    varying vec3 vColor2;",
"    #include common",
"    #include fog_pars_fragment",
"    #include bsdfs",
"    #include lights_pars_begin",
"    #include lights_physical_pars_fragment",
"#endif",
"",
"bool interior = false;",
"",
"float distSq3( vec3 v3a, vec3 v3b ){",
"    return (",
"        ( v3a.x - v3b.x ) * ( v3a.x - v3b.x ) +",
"        ( v3a.y - v3b.y ) * ( v3a.y - v3b.y ) +",
"        ( v3a.z - v3b.z ) * ( v3a.z - v3b.z )",
"    );",
"}",
"",
"// Calculate depth based on the given camera position.",
"float calcDepth( in vec3 cameraPos ){",
"    vec2 clipZW = cameraPos.z * projectionMatrix[2].zw + projectionMatrix[3].zw;",
"    return 0.5 + 0.5 * clipZW.x / clipZW.y;",
"}",
"",
"float calcClip( vec3 cameraPos ){",
"    return dot( vec4( cameraPos, 1.0 ), vec4( 0.0, 0.0, 1.0, nearClip - 0.5 ) );",
"}",
"",
"void main(){",
"",
"    vec3 point = w.xyz / w.w;",
"",
"    // unpacking",
"    vec3 base = base_radius.xyz;",
"    float vRadius = base_radius.w;",
"    vec3 end = end_b.xyz;",
"    float b = end_b.w;",
"",
"    vec3 end_cyl = end;",
"    vec3 surface_point = point;",
"",
"    vec3 ray_target = surface_point;",
"    vec3 ray_origin = vec3(0.0);",
"    vec3 ray_direction = mix(normalize(ray_origin - ray_target), vec3(0.0, 0.0, 1.0), ortho);",
"    mat3 basis = mat3( U, V, axis );",
"",
"    vec3 diff = ray_target - 0.5 * (base + end_cyl);",
"    vec3 P = diff * basis;",
"",
"    // angle (cos) between cylinder cylinder_axis and ray direction",
"    float dz = dot( axis, ray_direction );",
"",
"    float radius2 = vRadius*vRadius;",
"",
"    // calculate distance to the cylinder from ray origin",
"    vec3 D = vec3(dot(U, ray_direction),",
"                dot(V, ray_direction),",
"                dz);",
"    float a0 = P.x*P.x + P.y*P.y - radius2;",
"    float a1 = P.x*D.x + P.y*D.y;",
"    float a2 = D.x*D.x + D.y*D.y;",
"",
"    // calculate a dicriminant of the above quadratic equation",
"    float d = a1*a1 - a0*a2;",
"    if (d < 0.0)",
"        // outside of the cylinder",
"        discard;",
"",
"    float dist = (-a1 + sqrt(d)) / a2;",
"",
"    // point of intersection on cylinder surface",
"    vec3 new_point = ray_target + dist * ray_direction;",
"",
"    vec3 tmp_point = new_point - base;",
"    vec3 _normal = normalize( tmp_point - axis * dot(tmp_point, axis) );",
"",
"    ray_origin = mix( ray_origin, surface_point, ortho );",
"",
"    // test caps",
"    float front_cap_test = dot( tmp_point, axis );",
"    float end_cap_test = dot((new_point - end_cyl), axis);",
"",
"    // to calculate caps, simply check the angle between",
"    // the point of intersection - cylinder end vector",
"    // and a cap plane normal (which is the cylinder cylinder_axis)",
"    // if the angle < 0, the point is outside of cylinder",
"    // test front cap",
"",
"    #ifndef CAP",
"        vec3 new_point2 = ray_target + ( (-a1 - sqrt(d)) / a2 ) * ray_direction;",
"        vec3 tmp_point2 = new_point2 - base;",
"    #endif",
"",
"    // flat",
"    if (front_cap_test < 0.0)",
"    {",
"        // ray-plane intersection",
"        float dNV = dot(-axis, ray_direction);",
"        if (dNV < 0.0)",
"            discard;",
"        float near = dot(-axis, (base)) / dNV;",
"        vec3 front_point = ray_direction * near + ray_origin;",
"        // within the cap radius?",
"        if (dot(front_point - base, front_point-base) > radius2)",
"            discard;",
"",
"        #ifdef CAP",
"            new_point = front_point;",
"            _normal = axis;",
"        #else",
"            new_point = ray_target + ( (-a1 - sqrt(d)) / a2 ) * ray_direction;",
"            dNV = dot(-axis, ray_direction);",
"            near = dot(axis, end_cyl) / dNV;",
"            new_point2 = ray_direction * near + ray_origin;",
"            if (dot(new_point2 - end_cyl, new_point2-base) < radius2)",
"                discard;",
"            interior = true;",
"        #endif",
"    }",
"",
"    // test end cap",
"",
"",
"    // flat",
"    if( end_cap_test > 0.0 )",
"    {",
"        // ray-plane intersection",
"        float dNV = dot(axis, ray_direction);",
"        if (dNV < 0.0)",
"            discard;",
"        float near = dot(axis, end_cyl) / dNV;",
"        vec3 end_point = ray_direction * near + ray_origin;",
"        // within the cap radius?",
"        if( dot(end_point - end_cyl, end_point-base) > radius2 )",
"            discard;",
"",
"        #ifdef CAP",
"            new_point = end_point;",
"            _normal = axis;",
"        #else",
"            new_point = ray_target + ( (-a1 - sqrt(d)) / a2 ) * ray_direction;",
"            dNV = dot(-axis, ray_direction);",
"            near = dot(-axis, (base)) / dNV;",
"            new_point2 = ray_direction * near + ray_origin;",
"            if (dot(new_point2 - base, new_point2-base) < radius2)",
"                discard;",
"            interior = true;",
"        #endif",
"    }",
"",
"    gl_FragDepthEXT = calcDepth( new_point );",
"",
"    #ifdef NEAR_CLIP",
"        if( calcClip( new_point ) > 0.0 ){",
"            dist = (-a1 - sqrt(d)) / a2;",
"            new_point = ray_target + dist * ray_direction;",
"            if( calcClip( new_point ) > 0.0 )",
"                discard;",
"            interior = true;",
"            gl_FragDepthEXT = calcDepth( new_point );",
"            if( gl_FragDepthEXT >= 0.0 ){",
"                gl_FragDepthEXT = max( 0.0, calcDepth( vec3( - ( nearClip - 0.5 ) ) ) + ( 0.0000001 / vRadius ) );",
"            }",
"        }else if( gl_FragDepthEXT <= 0.0 ){",
"            dist = (-a1 - sqrt(d)) / a2;",
"            new_point = ray_target + dist * ray_direction;",
"            interior = true;",
"            gl_FragDepthEXT = calcDepth( new_point );",
"            if( gl_FragDepthEXT >= 0.0 ){",
"                gl_FragDepthEXT = 0.0 + ( 0.0000001 / vRadius );",
"            }",
"        }",
"    #else",
"        if( gl_FragDepthEXT <= 0.0 ){",
"            dist = (-a1 - sqrt(d)) / a2;",
"            new_point = ray_target + dist * ray_direction;",
"            interior = true;",
"            gl_FragDepthEXT = calcDepth( new_point );",
"            if( gl_FragDepthEXT >= 0.0 ){",
"                gl_FragDepthEXT = 0.0 + ( 0.0000001 / vRadius );",
"            }",
"        }",
"    #endif",
"",
"    // this is a workaround necessary for Mac",
"    // otherwise the modified fragment won't clip properly",
"    if (gl_FragDepthEXT < 0.0)",
"        discard;",
"    if (gl_FragDepthEXT > 1.0)",
"        discard;",
"",
"    #ifdef PICKING",
"",
"        gl_FragColor = vec4( vPickingColor, objectId );",
"",
"    #else",
"",
"        vec3 vViewPosition = -new_point;",
"        vec3 vNormal = _normal;",
"        vec3 vColor;",
"",
"        if( distSq3( new_point, end_cyl ) < distSq3( new_point, base ) ){",
"            if( b < 0.0 ){",
"                vColor = vColor1;",
"            }else{",
"                vColor = vColor2;",
"            }",
"        }else{",
"            if( b > 0.0 ){",
"                vColor = vColor1;",
"            }else{",
"                vColor = vColor2;",
"            }",
"        }",
"",
"        vec4 diffuseColor = vec4( diffuse, opacity );",
"        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
"        vec3 totalEmissiveLight = emissive;",
"",
"        #include color_fragment",
"     //ifdef USE_COLOR",
"     //diffuseColor.r *= vColor[0];",
"     //diffuseColor.g *= vColor[1];",
"     //diffuseColor.b *= vColor[2];",
"     //endif",
"        #include roughnessmap_fragment",
"        #include metalnessmap_fragment",
"",
"        // don't use include normal_fragment",
"        vec3 normal = normalize( vNormal );",
"",
"        #include lights_physical_fragment",
"        //include lights_template",
"        #include lights_fragment_begin",
"        #include lights_fragment_end",
"",
"        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveLight;",
"",
"        gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
"        //gl_FragColor = vec4( reflectedLight.directSpecular, diffuseColor.a );",
"",
"        #include premultiplied_alpha_fragment",
"        #include tonemapping_fragment",
"        #include encodings_fragment",
"        #include fog_fragment",
"    #endif",
"",
"}"
].join("\n");

$NGL_shaderTextHash['CylinderImpostor.vert'] = ["// Open-Source PyMOL is Copyright (C) Schrodinger, LLC.",
"//",
"//  All Rights Reserved",
"//",
"//  Permission to use, copy, modify, distribute, and distribute modified",
"//  versions of this software and its built-in documentation for any",
"//  purpose and without fee is hereby granted, provided that the above",
"//  copyright notice appears in all copies and that both the copyright",
"//  notice and this permission notice appear in supporting documentation,",
"//  and that the name of Schrodinger, LLC not be used in advertising or",
"//  publicity pertaining to distribution of the software without specific,",
"//  written prior permission.",
"//",
"//  SCHRODINGER, LLC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,",
"//  INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN",
"//  NO EVENT SHALL SCHRODINGER, LLC BE LIABLE FOR ANY SPECIAL, INDIRECT OR",
"//  CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS",
"//  OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE",
"//  OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE",
"//  USE OR PERFORMANCE OF THIS SOFTWARE.",
"",
"// Contributions by Alexander Rose",
"// - ported to WebGL",
"// - dual color",
"// - pk color",
"// - shift",
"",
"attribute vec3 mapping;",
"attribute vec3 position1;",
"attribute vec3 position2;",
"attribute float radius;",
"",
"varying vec3 axis;",
"varying vec4 base_radius;",
"varying vec4 end_b;",
"varying vec3 U;",
"varying vec3 V;",
"varying vec4 w;",
"varying float fogDepth;",
"",
"#ifdef PICKING",
"    #include unpack_clr",
"    attribute float primitiveId;",
"    varying vec3 vPickingColor;",
"#else",
"    //attribute vec3 color;",
"    attribute vec3 color2;",
"    varying vec3 vColor1;",
"    varying vec3 vColor2;",
"#endif",
"",
"uniform mat4 modelViewMatrixInverse;",
"uniform float ortho;",
"",
"//include matrix_scale",
"float matrixScale( in mat4 m ){",
"    vec4 r = m[ 0 ];",
"    return sqrt( r[ 0 ] * r[ 0 ] + r[ 1 ] * r[ 1 ] + r[ 2 ] * r[ 2 ] );",
"}",
"",
"void main(){",
"",
"    #ifdef PICKING",
"        vPickingColor = unpackColor( primitiveId );",
"    #else",
"        vColor1 = color;",
"        vColor2 = color2;",
"    #endif",
"",
"    // vRadius = radius;",
"    base_radius.w = radius * matrixScale( modelViewMatrix );",
"",
"    //vec3 center = position;",
"    vec3 center = ( position2 + position1 ) / 2.0;",
"    vec3 dir = normalize( position2 - position1 );",
"    float ext = length( position2 - position1 ) / 2.0;",
"",
"    // using cameraPosition fails on some machines, not sure why",
"    // vec3 cam_dir = normalize( cameraPosition - mix( center, vec3( 0.0 ), ortho ) );",
"    vec3 cam_dir;",
"    if( ortho == 0.0 ){",
"        cam_dir = ( modelViewMatrixInverse * vec4( 0, 0, 0, 1 ) ).xyz - center;",
"    }else{",
"        cam_dir = ( modelViewMatrixInverse * vec4( 0, 0, 1, 0 ) ).xyz;",
"    }",
"    cam_dir = normalize( cam_dir );",
"",
"    vec3 ldir;",
"",
"    float b = dot( cam_dir, dir );",
"    end_b.w = b;",
"    // direction vector looks away, so flip",
"    if( b < 0.0 )",
"        ldir = -ext * dir;",
"    // direction vector already looks in my direction",
"    else",
"        ldir = ext * dir;",
"",
"    vec3 left = normalize( cross( cam_dir, ldir ) );",
"    left = radius * left;",
"    vec3 up = radius * normalize( cross( left, ldir ) );",
"",
"    // transform to modelview coordinates",
"    axis = normalize( normalMatrix * ldir );",
"    U = normalize( normalMatrix * up );",
"    V = normalize( normalMatrix * left );",
"",
"    vec4 base4 = modelViewMatrix * vec4( center - ldir, 1.0 );",
"    base_radius.xyz = base4.xyz / base4.w;",
"",
"    vec4 top_position = modelViewMatrix * vec4( center + ldir, 1.0 );",
"    vec4 end4 = top_position;",
"    end_b.xyz = end4.xyz / end4.w;",
"",
"    w = modelViewMatrix * vec4(",
"        center + mapping.x*ldir + mapping.y*left + mapping.z*up, 1.0",
"    );",
"",
"    gl_Position = projectionMatrix * w;",
"",
"    // avoid clipping (1.0 seems to induce flickering with some drivers)",
"    gl_Position.z = 0.99;",
"",
"}"
].join("\n");

$NGL_shaderTextHash['SphereInstancing.frag'] = $NGL_shaderTextHash['SphereImpostor.frag'];

$NGL_shaderTextHash['SphereInstancing.vert'] = ["uniform mat4 projectionMatrixInverse;",
"uniform float nearClip;",
"",
"varying float vRadius;",
"varying float vRadiusSq;",
"varying vec3 vPoint;",
"varying vec3 vPointViewPosition;",
"varying float fogDepth;",
"",
"attribute vec2 mapping;",
"//attribute vec3 position;",
"attribute float radius;",
"attribute vec4 matrix1;",
"attribute vec4 matrix2;",
"attribute vec4 matrix3;",
"attribute vec4 matrix4;",
"",
"#ifdef PICKING",
"    #include unpack_clr",
"    attribute float primitiveId;",
"    varying vec3 vPickingColor;",
"#else",
"    #include color_pars_vertex",
"#endif",
"",
"//include matrix_scale",
"float matrixScale( in mat4 m ){",
"    vec4 r = m[ 0 ];",
"    return sqrt( r[ 0 ] * r[ 0 ] + r[ 1 ] * r[ 1 ] + r[ 2 ] * r[ 2 ] );",
"}",
"",
"const mat4 D = mat4(",
"    1.0, 0.0, 0.0, 0.0,",
"    0.0, 1.0, 0.0, 0.0,",
"    0.0, 0.0, 1.0, 0.0,",
"    0.0, 0.0, 0.0, -1.0",
");",
"",
"mat4 transpose( in mat4 inMatrix ) {",
"    vec4 i0 = inMatrix[0];",
"    vec4 i1 = inMatrix[1];",
"    vec4 i2 = inMatrix[2];",
"    vec4 i3 = inMatrix[3];",
"",
"    mat4 outMatrix = mat4(",
"        vec4(i0.x, i1.x, i2.x, i3.x),",
"        vec4(i0.y, i1.y, i2.y, i3.y),",
"        vec4(i0.z, i1.z, i2.z, i3.z),",
"        vec4(i0.w, i1.w, i2.w, i3.w)",
"    );",
"    return outMatrix;",
"}",
"",
"//------------------------------------------------------------------------------",
"// Compute point size and center using the technique described in:",
"// 'GPU-Based Ray-Casting of Quadratic Surfaces'",
"// by Christian Sigg, Tim Weyrich, Mario Botsch, Markus Gross.",
"//",
"// Code based on",
"/*=========================================================================",
"",
" Program:   Visualization Toolkit",
" Module:    Quadrics_fs.glsl and Quadrics_vs.glsl",
"",
" Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen",
" All rights reserved.",
" See Copyright.txt or http://www.kitware.com/Copyright.htm for details.",
"",
" This software is distributed WITHOUT ANY WARRANTY; without even",
" the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR",
" PURPOSE.  See the above copyright notice for more information.",
"",
" =========================================================================*/",
"",
"// .NAME Quadrics_fs.glsl and Quadrics_vs.glsl",
"// .SECTION Thanks",
"// <verbatim>",
"//",
"//  This file is part of the PointSprites plugin developed and contributed by",
"//",
"//  Copyright (c) CSCS - Swiss National Supercomputing Centre",
"//                EDF - Electricite de France",
"//",
"//  John Biddiscombe, Ugo Varetto (CSCS)",
"//  Stephane Ploix (EDF)",
"//",
"// </verbatim>",
"//",
"// Contributions by Alexander Rose",
"// - ported to WebGL",
"// - adapted to work with quads",
"void ComputePointSizeAndPositionInClipCoordSphere(vec4 updatePosition){",
"",
"    vec2 xbc;",
"    vec2 ybc;",
"",
"    mat4 T = mat4(",
"        radius, 0.0, 0.0, 0.0,",
"        0.0, radius, 0.0, 0.0,",
"        0.0, 0.0, radius, 0.0,",
"        updatePosition.x, updatePosition.y, updatePosition.z, 1.0",
"    );",
"",
"    mat4 R = transpose( projectionMatrix * modelViewMatrix * T );",
"    float A = dot( R[ 3 ], D * R[ 3 ] );",
"    float B = -2.0 * dot( R[ 0 ], D * R[ 3 ] );",
"    float C = dot( R[ 0 ], D * R[ 0 ] );",
"    xbc[ 0 ] = ( -B - sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    xbc[ 1 ] = ( -B + sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    float sx = abs( xbc[ 0 ] - xbc[ 1 ] ) * 0.5;",
"",
"    A = dot( R[ 3 ], D * R[ 3 ] );",
"    B = -2.0 * dot( R[ 1 ], D * R[ 3 ] );",
"    C = dot( R[ 1 ], D * R[ 1 ] );",
"    ybc[ 0 ] = ( -B - sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    ybc[ 1 ] = ( -B + sqrt( B * B - 4.0 * A * C ) ) / ( 2.0 * A );",
"    float sy = abs( ybc[ 0 ] - ybc[ 1 ]  ) * 0.5;",
"",
"    gl_Position.xy = vec2( 0.5 * ( xbc.x + xbc.y ), 0.5 * ( ybc.x + ybc.y ) );",
"    gl_Position.xy -= mapping * vec2( sx, sy );",
"    gl_Position.xy *= gl_Position.w;",
"",
"}",
"",
"  mat4 computeMat(vec4 v1, vec4 v2, vec4 v3, vec4 v4) {",
"    return mat4(",
"      v1.x, v1.y, v1.z, v1.w,",
"      v2.x, v2.y, v2.z, v2.w,",
"      v3.x, v3.y, v3.z, v3.w,",
"      v4.x, v4.y, v4.z, v4.w",
"    );",
"  }",
"",
"void main(void){",
"",
"    #ifdef PICKING",
"        vPickingColor = unpackColor( primitiveId );",
"    #else",
"        #include color_vertex",
"    #endif",
"",
"    vRadius = radius * matrixScale( modelViewMatrix );",
"",
"    mat4 matrix = computeMat(matrix1, matrix2, matrix3, matrix4);",
"    vec4 updatePosition = matrix * vec4(position, 1.0);",
"",
"//    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
"    vec4 mvPosition = modelViewMatrix * vec4( updatePosition.xyz, 1.0 );",
"    // avoid clipping, added again in fragment shader",
"    mvPosition.z -= vRadius;",
"",
"//    gl_Position = projectionMatrix * vec4( mvPosition.xyz, 1.0 );",
"    gl_Position = projectionMatrix * vec4( mvPosition.xyz, 1.0 );",
"    ComputePointSizeAndPositionInClipCoordSphere(updatePosition);",
"",
"",
"    vRadiusSq = vRadius * vRadius;",
"    vec4 vPoint4 = projectionMatrixInverse * gl_Position;",
"    vPoint = vPoint4.xyz / vPoint4.w;",
"    vPointViewPosition = -mvPosition.xyz / mvPosition.w;",
"",
"}"
].join("\n");

$NGL_shaderTextHash['CylinderInstancing.frag'] = $NGL_shaderTextHash['CylinderImpostor.frag'];
$NGL_shaderTextHash['CylinderInstancing.vert'] = ["// Open-Source PyMOL is Copyright (C) Schrodinger, LLC.",
"//",
"//  All Rights Reserved",
"//",
"//  Permission to use, copy, modify, distribute, and distribute modified",
"//  versions of this software and its built-in documentation for any",
"//  purpose and without fee is hereby granted, provided that the above",
"//  copyright notice appears in all copies and that both the copyright",
"//  notice and this permission notice appear in supporting documentation,",
"//  and that the name of Schrodinger, LLC not be used in advertising or",
"//  publicity pertaining to distribution of the software without specific,",
"//  written prior permission.",
"//",
"//  SCHRODINGER, LLC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,",
"//  INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN",
"//  NO EVENT SHALL SCHRODINGER, LLC BE LIABLE FOR ANY SPECIAL, INDIRECT OR",
"//  CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS",
"//  OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE",
"//  OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE",
"//  USE OR PERFORMANCE OF THIS SOFTWARE.",
"",
"// Contributions by Alexander Rose",
"// - ported to WebGL",
"// - dual color",
"// - pk color",
"// - shift",
"",
"attribute vec3 mapping;",
"attribute vec3 position1;",
"attribute vec3 position2;",
"attribute float radius;",
"attribute vec4 matrix1;",
"attribute vec4 matrix2;",
"attribute vec4 matrix3;",
"attribute vec4 matrix4;",
"",
"varying vec3 axis;",
"varying vec4 base_radius;",
"varying vec4 end_b;",
"varying vec3 U;",
"varying vec3 V;",
"varying vec4 w;",
"varying float fogDepth;",
"",
"#ifdef PICKING",
"    #include unpack_clr",
"    attribute float primitiveId;",
"    varying vec3 vPickingColor;",
"#else",
"    //attribute vec3 color;",
"    attribute vec3 color2;",
"    varying vec3 vColor1;",
"    varying vec3 vColor2;",
"#endif",
"",
"uniform mat4 modelViewMatrixInverse;",
"uniform float ortho;",
"",
"//include matrix_scale",
"float matrixScale( in mat4 m ){",
"    vec4 r = m[ 0 ];",
"    return sqrt( r[ 0 ] * r[ 0 ] + r[ 1 ] * r[ 1 ] + r[ 2 ] * r[ 2 ] );",
"}",
"",
"  mat4 computeMat(vec4 v1, vec4 v2, vec4 v3, vec4 v4) {",
"    return mat4(",
"      v1.x, v1.y, v1.z, v1.w,",
"      v2.x, v2.y, v2.z, v2.w,",
"      v3.x, v3.y, v3.z, v3.w,",
"      v4.x, v4.y, v4.z, v4.w",
"    );",
"  }",
"",
"void main(){",
"",
"    #ifdef PICKING",
"        vPickingColor = unpackColor( primitiveId );",
"    #else",
"        vColor1 = color;",
"        vColor2 = color2;",
"    #endif",
"",
"    // vRadius = radius;",
"    base_radius.w = radius * matrixScale( modelViewMatrix );",
"",
"    //vec3 center = ( position2 + position1 ) / 2.0;",
"",
"    mat4 matrix = computeMat(matrix1, matrix2, matrix3, matrix4);",
"    vec4 updatePosition1 = matrix * vec4(position1, 1.0);",
"    vec4 updatePosition2 = matrix * vec4(position2, 1.0);",
"    vec3 center = ( updatePosition2.xyz + updatePosition1.xyz ) / 2.0;",
"",
"    //vec3 dir = normalize( position2 - position1 );",
"    vec3 dir = normalize( updatePosition2.xyz - updatePosition1.xyz );",
"    float ext = length( position2 - position1 ) / 2.0;",
"",
"    // using cameraPosition fails on some machines, not sure why",
"    // vec3 cam_dir = normalize( cameraPosition - mix( center, vec3( 0.0 ), ortho ) );",
"    vec3 cam_dir;",
"    if( ortho == 0.0 ){",
"        cam_dir = ( modelViewMatrixInverse * vec4( 0, 0, 0, 1 ) ).xyz - center;",
"    }else{",
"        cam_dir = ( modelViewMatrixInverse * vec4( 0, 0, 1, 0 ) ).xyz;",
"    }",
"    cam_dir = normalize( cam_dir );",
"",
"    vec3 ldir;",
"",
"    float b = dot( cam_dir, dir );",
"    end_b.w = b;",
"    // direction vector looks away, so flip",
"    if( b < 0.0 )",
"        ldir = -ext * dir;",
"    // direction vector already looks in my direction",
"    else",
"        ldir = ext * dir;",
"",
"    vec3 left = normalize( cross( cam_dir, ldir ) );",
"    left = radius * left;",
"    vec3 up = radius * normalize( cross( left, ldir ) );",
"",
"    // transform to modelview coordinates",
"    axis = normalize( normalMatrix * ldir );",
"    U = normalize( normalMatrix * up );",
"    V = normalize( normalMatrix * left );",
"",
"    vec4 base4 = modelViewMatrix * vec4( center - ldir, 1.0 );",
"    base_radius.xyz = base4.xyz / base4.w;",
"",
"    vec4 top_position = modelViewMatrix * vec4( center + ldir, 1.0 );",
"    vec4 end4 = top_position;",
"    end_b.xyz = end4.xyz / end4.w;",
"",
"    w = modelViewMatrix * vec4(",
"        center + mapping.x*ldir + mapping.y*left + mapping.z*up, 1.0",
"    );",
"",
"    gl_Position = projectionMatrix * w;",
"",
"    // avoid clipping (1.0 seems to induce flickering with some drivers)",
"    gl_Position.z = 0.99;",
"",
"}"
].join("\n");

$NGL_shaderTextHash['Instancing.frag'] = ["#define STANDARD",
"uniform vec3 diffuse;",
"uniform vec3 emissive;",
"uniform float roughness;",
"uniform float metalness;",
"uniform float opacity;",
"uniform float nearClip;",
"uniform float clipRadius;",
"uniform mat4 projectionMatrix;",
"uniform float ortho;",
"varying float bCylinder;",
"",
"#if defined( NEAR_CLIP ) || defined( RADIUS_CLIP ) || ( !defined( PICKING ) && !defined( NOLIGHT ) )",
"    varying vec3 vViewPosition;",
"#endif",
"",
"#if defined( RADIUS_CLIP )",
"    varying vec3 vClipCenter;",
"#endif",
"",
"#if defined( PICKING )",
"    uniform float objectId;",
"    varying vec3 vPickingColor;",
"#elif defined( NOLIGHT )",
"    varying vec3 vColor;",
"#else",
"    #ifndef FLAT_SHADED",
"        varying vec3 vNormal;",
"    #endif",
"    #include common",
"    #include color_pars_fragment",
"    #include fog_pars_fragment",
"    #include bsdfs",
"    #include lights_pars_begin",
"    #include lights_physical_pars_fragment",
"#endif",
"",
"void main(){",
"    #include nearclip_fragment",
"    #include radiusclip_fragment",
"",
"    #if defined( PICKING )",
"",
"        gl_FragColor = vec4( vPickingColor, objectId );",
"",
"    #elif defined( NOLIGHT )",
"",
"        gl_FragColor = vec4( vColor, opacity );",
"",
"    #else",
"",
"        vec4 diffuseColor = vec4( diffuse, opacity );",
"        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
"        vec3 totalEmissiveLight = emissive;",
"",
"        #include color_fragment",
"        #include roughnessmap_fragment",
"        #include metalnessmap_fragment",
"        #include normal_flip",
"        #include normal_fragment_begin",
"",
"        //include dull_interior_fragment",
"",
"        #include lights_physical_fragment",
"        //include lights_template",
"        #include lights_fragment_begin",
"        #include lights_fragment_end",
"",
"        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveLight;",
"",
"        #include interior_fragment",
"",
"        gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
"",
"        #include premultiplied_alpha_fragment",
"        #include tonemapping_fragment",
"        #include encodings_fragment",
"        #include fog_fragment",
"",
"        #include opaque_back_fragment",
"",
"    #endif",
"",
"}"
].join("\n");

$NGL_shaderTextHash['Instancing.vert'] = ["#define STANDARD",
"",
"uniform mat4 projectionMatrixInverse;",
"uniform float nearClip;",
"uniform vec3 clipCenter;",
"attribute vec4 matrix1;",
"attribute vec4 matrix2;",
"attribute vec4 matrix3;",
"attribute vec4 matrix4;",
"attribute float cylinder;",
"varying float bCylinder;",
"",
"#if defined( NEAR_CLIP ) || defined( RADIUS_CLIP ) || ( !defined( PICKING ) && !defined( NOLIGHT ) )",
"    varying vec3 vViewPosition;",
"#endif",
"",
"#if defined( RADIUS_CLIP )",
"    varying vec3 vClipCenter;",
"#endif",
"",
"#if defined( PICKING )",
"    #include unpack_color",
"    attribute float primitiveId;",
"    varying vec3 vPickingColor;",
"#elif defined( NOLIGHT )",
"    varying vec3 vColor;",
"#else",
"    #include color_pars_vertex",
"    #ifndef FLAT_SHADED",
"        varying vec3 vNormal;",
"    #endif",
"#endif",
"",
"#include common",
"",
"  mat4 computeMat(vec4 v1, vec4 v2, vec4 v3, vec4 v4) {",
"    return mat4(",
"      v1.x, v1.y, v1.z, v1.w,",
"      v2.x, v2.y, v2.z, v2.w,",
"      v3.x, v3.y, v3.z, v3.w,",
"      v4.x, v4.y, v4.z, v4.w",
"    );",
"  }",
"",
"void main(){",
"    bCylinder = cylinder;",
"",
"    mat4 matrix = computeMat(matrix1, matrix2, matrix3, matrix4);",
"    vec4 updatePosition = matrix * vec4(position, 1.0);",
"",
"    #if defined( PICKING )",
"        vPickingColor = unpackColor( primitiveId );",
"    #elif defined( NOLIGHT )",
"        vColor = color;",
"    #else",
"        #include color_vertex",
"        //include beginnormal_vertex",
"        //vec3 objectNormal = vec3( normal );",
"        vec3 objectNormal = vec3(matrix * vec4(normal,0.0));",
"        #include defaultnormal_vertex",
"        // Normal computed with derivatives when FLAT_SHADED",
"        #ifndef FLAT_SHADED",
"            vNormal = normalize( transformedNormal );",
"        #endif",
"    #endif",
"",
"    //include begin_vertex",
"    vec3 transformed = updatePosition.xyz;",
"    //include project_vertex",
"    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );",
"    gl_Position = projectionMatrix * mvPosition;",
"",
"    #if defined( NEAR_CLIP ) || defined( RADIUS_CLIP ) || ( !defined( PICKING ) && !defined( NOLIGHT ) )",
"        vViewPosition = -mvPosition.xyz;",
"    #endif",
"",
"    #if defined( RADIUS_CLIP )",
"        vClipCenter = -( modelViewMatrix * vec4( clipCenter, 1.0 ) ).xyz;",
"    #endif",
"",
"    #include nearclip_vertex",
"",
"}"
].join("\n");

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

if (typeof jQuery === 'undefined') { throw new Error('iCn3D requires jQuery') }

var iCn3D = function (id) {
    this.id = id;

    this.container = $('#' + id);

    this.maxatomcnt = 100000; // for a biological assembly, use instancing when the total number of atomsis greater than "maxatomcnt"

    this.overdraw = 0;

    this.bDrawn = false;

    this.bSecondaryStructure = false;

    this.bHighlight = 1; // undefined: no highlight, 1: highlight by outline, 2: highlight by 3D object
    this.renderOrderPicking = -1; // less than 0, the default order is 0

    this.ALTERNATE_STRUCTURE = -1;

    if(Detector.webgl){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container.get(0),
            antialias: true,
            preserveDrawingBuffer: true,
            sortObjects: false,
            alpha: true
        });

        this.overdraw = 0;
    }
    else {
        alert("Currently your web browser has a problem on WebGL. If you are using Chrome, open a new tab for the same URL and WebGL may work again.");
/*
        alert("Currently your web browser has a problem on WebGL, and CanvasRenderer instead of WebGLRenderer is used. If you are using Chrome, open a new tab for the same URL and WebGL may work again.");

        this.renderer = new THREE.CanvasRenderer({
            canvas: this.container.get(0)
        });

        //http://threejs.org/docs/api/materials/Material.html
        this.overdraw = 0.5;

        // only WebGL support outlines using ShaderMaterial
        this.bHighlight = 2;
*/
    }

    this.matShader = this.setOutlineColor('yellow');
    this.frac = new THREE.Color(0.1, 0.1, 0.1);

    // mobile has a problem when the scaleFactor is 2.0
    // the scaleFactor improve the image quality
    this.scaleFactor = 1.5;

    // Impostor shaders
    this.bImpo = true;
    this.bExtFragDepth = this.renderer.extensions.get( "EXT_frag_depth" );
    if(!this.bExtFragDepth) {
        this.bImpo = false;
        console.log('EXT_frag_depth is NOT supported. All spheres and cylinders are drawn using geometry.');
    }
    else {
        console.log('EXT_frag_depth is supported. All spheres and cylinders are drawn using shaders.');
    }

    this.bInstanced = this.renderer.extensions.get( "ANGLE_instanced_arrays" );
    if(!this.bInstanced) {
        console.log('ANGLE_instanced_arrays is NOT supported. Assembly is drawn by making copies of the asymmetric unit.');
    }
    else {
        console.log('ANGLE_instanced_arrays is supported. Assembly is drawn with one copy of the asymmetric unit using hardware instancing.');
    }

        // cylinder impostor
    this.posArray = new Array();
    this.colorArray = new Array();

    this.pos2Array = new Array();
    this.color2Array = new Array();

    this.radiusArray = new Array();

        // sphere impostor
    this.posArraySphere = new Array();
    this.colorArraySphere = new Array();
    this.radiusArraySphere = new Array();

    // adjust the size
    this.WIDTH = this.container.width(), this.HEIGHT = this.container.height();
    this.setWidthHeight(this.WIDTH, this.HEIGHT);

    this.axis = false;  // used to turn on and off xyz axes

    // pk
    this.pk = 1; // 0: no pk, 1: pk on atoms, 2: pk on residues, 3: pk on strand/helix/coil, 4: pk on chain
    this.highlightlevel = 1; // 1: highlight on atoms, 2: highlight on residues, 3: highlight on strand/helix/coil 4: highlight on chain 5: highlight on structure

    this.pickpair = false; // used for pk pair of atoms for label and distance
    this.pAtomNum = 0;

    this.pAtom = undefined;
    this.pAtom2 = undefined;

    this.bCtrl = false; // if true, union selection on sequence window or on 3D structure
    this.bShift = false; // if true, select a range on 3D structure

    this.bStopRotate = false; // by default, do not stop the possible automatic rotation
    this.bCalphaOnly = false; // by default the input has both Calpha and O, used for drawing strands. If atoms have Calpha only, the orientation of the strands is random
//    this.bSSOnly = false; // a flag to turn on when only helix and bricks are available to draw 3D dgm

    this.bAllAtoms = true; // no need to adjust atom for strand style

    this.bConsiderNeighbors = false; // a flag to show surface considering the neighboring atoms or not

    this.bShowCrossResidueBond = false;

    this.effects = {
        //'anaglyph': new THREE.AnaglyphEffect(this.renderer),
        //'parallax barrier': new THREE.ParallaxBarrierEffect(this.renderer),
        //'oculus rift': new THREE.OculusRiftEffect(this.renderer),
        //'stereo': new THREE.StereoEffect(this.renderer),
        'none': this.renderer
    };

    this.maxD = 500; // size of the molecule
    this.oriMaxD = this.maxD; // size of the molecule
    //this.cam_z = -150;

    this.cam_z = this.maxD * 2; // when zooming in, it gets dark if the camera is in front
    //this.cam_z = -this.maxD * 2;

    // these variables will not be cleared for each structure
    this.commands = []; // a list of commands, ordered by the operation steps. Each operation will be converted into a command. this command list can be used to go backward and forward.
    this.optsHistory = []; // a list of options corresponding to this.commands.
    this.logs = []; // a list of comands and other logs, ordered by the operation steps.

    this.bRender = true; // a flag to turn off rendering when loading state file

    // Default values
    this.hColor = new THREE.Color(0xFFFF00);

    this.sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
    this.cylinderGeometryOutline = new THREE.CylinderGeometry(1, 1, 1, 32, 1, true);
    this.axisDIV = 5; // 3
    this.strandDIV = 6;
    this.tubeDIV = 8;
    this.nucleicAcidStrandDIV = 6; //4;

    this.linewidth = 1;
    this.hlLineRadius = 0.1; // style line, highlight
    //this.curveWidth = 3;

    this.lineRadius = 0.1; // hbonds, distance lines
    this.coilWidth = 0.3; //0.4; // style cartoon-coil
    this.cylinderRadius = 0.4; // style stick
    this.traceRadius = 0.4; //0.2; // c alpha trace, nucleotide stick
    this.dotSphereScale = 0.3; // style ball and stick, dot
    this.sphereRadius = 1.5; // style sphere
    this.cylinderHelixRadius = 1.6; // style sylinder and plate

    this.ribbonthickness = 0.2; // 0.4; // style ribbon, nucleotide cartoon, stand thickness
    this.helixSheetWidth = 1.3; // style ribbon, nucleotide cartoon, stand thickness
    this.nucleicAcidWidth = 0.8; // nucleotide cartoon

    this.threshbox = 180; // maximum possible boxsize, default 180
    this.maxAtoms3DMultiFile = 40000; // above the threshold, multiple files wil be output for 3D printing

    this.LABELSIZE = 30;

    this.opts = {
        camera: 'perspective',
        background: 'transparent',
        color: 'chain',
        sidec: 'nothing',
        proteins: 'ribbon',
        nucleotides: 'nucleotide cartoon',
        surface: 'nothing',
        wireframe: 'no',
        map: 'nothing',
        mapwireframe: 'yes',
        emmap: 'nothing',
        emmapwireframe: 'yes',
        opacity: '1.0',
        chemicals: 'stick',
        water: 'nothing',
        ions: 'sphere',
        //labels: 'no',
        //effect: 'none',
        hbonds: 'no',
        //stabilizer: 'no',
        ssbonds: 'no',
        //ncbonds: 'no',
        labels: 'no',
        lines: 'no',
        rotationcenter: 'molecule center',
        axis: 'no',
        fog: 'no',
        slab: 'no',
        pk: 'residue',
        nucleotides: 'nucleotide cartoon',
        chemicalbinding: 'hide'
    };

    this._zoomFactor = 1.0;
    this.mouseChange = new THREE.Vector2(0,0);
    this.quaternion = new THREE.Quaternion(0,0,0,1);

    var me = this;
    this.container.bind('contextmn', function (e) {
        e.preventDefault();
    });

    //me.switchHighlightLevel();

    // key event has to use the document because it requires the focus
    me.typetext = false;

    //http://unixpapa.com/js/key.html
    $(document).bind('keyup', function (e) {
      if(e.keyCode === 16) { // shiftKey
          me.bShift = false;
      }
      if(e.keyCode === 17 || e.keyCode === 224 || e.keyCode === 91) { // ctrlKey or apple command key
          me.bCtrl = false;
      }
    });

    $('input[type=text], textarea').focus(function() {
        me.typetext = true;
    });

    $('input[type=text], textarea').blur(function() {
        me.typetext = false;
    });

    $(document).bind('keydown', function (e) {
      if(e.shiftKey || e.keyCode === 16) {
          me.bShift = true;
      }
      if(e.ctrlKey || e.keyCode === 17 || e.keyCode === 224 || e.keyCode === 91) {
          me.bCtrl = true;
      }

      if (!me.controls) return;

      me.bStopRotate = true;

      if(!me.typetext) {
        // zoom
        if(e.keyCode === 90 ) { // Z
          var para = {};

          if(me.cam === me.perspectiveCamera) { // perspective
            para._zoomFactor = 0.9;
          }
          else if(me.cam === me.orthographicCamera) {  // orthographics
            if(me._zoomFactor < 0.1) {
              me._zoomFactor = 0.1;
            }
            else if(me._zoomFactor > 1) {
              me._zoomFactor = 1;
            }

            para._zoomFactor = me._zoomFactor * 0.8;
            if(para._zoomFactor < 0.1) para._zoomFactor = 0.1;
          }

          para.update = true;
          me.controls.update(para);
          me.render();
        }
        else if(e.keyCode === 88 ) { // X
          var para = {};

          if(me.cam === me.perspectiveCamera) { // perspective
            //para._zoomFactor = 1.1;
            para._zoomFactor = 1.03;
          }
          else if(me.cam === me.orthographicCamera) {  // orthographics
            if(me._zoomFactor > 10) {
              me._zoomFactor = 10;
            }
            else if(me._zoomFactor < 1) {
              me._zoomFactor = 1;
            }

            para._zoomFactor = me._zoomFactor * 1.01;
            if(para._zoomFactor > 10) para._zoomFactor = 10;
          }

          para.update = true;
          me.controls.update(para);
          me.render();
        }

        // rotate
        else if(e.keyCode === 76 ) { // L, rotate left
          var axis = new THREE.Vector3(0,1,0);
          var angle = -5.0 / 180.0 * Math.PI;

          me.setRotation(axis, angle);
        }
        else if(e.keyCode === 74 ) { // J, rotate right
          var axis = new THREE.Vector3(0,1,0);
          var angle = 5.0 / 180.0 * Math.PI;

          me.setRotation(axis, angle);
        }
        else if(e.keyCode === 73 ) { // I, rotate up
          var axis = new THREE.Vector3(1,0,0);
          var angle = -5.0 / 180.0 * Math.PI;

          me.setRotation(axis, angle);
        }
        else if(e.keyCode === 77 ) { // M, rotate down
          var axis = new THREE.Vector3(1,0,0);
          var angle = 5.0 / 180.0 * Math.PI;

          me.setRotation(axis, angle);
        }

        else if(e.keyCode === 65 ) { // A, alternate
           if(Object.keys(me.structures).length > 1) {
               me.alternateStructures();
           }
        }

      }
    });

    this.container.bind('mouseup touchend', function (e) {
        me.isDragging = false;
    });
    //this.container.bind('mousedown touchstart', function (e) {
    this.container.bind('mousedown', function (e) {
        e.preventDefault();
        me.isDragging = true;

        if (!me.scene) return;

        me.bStopRotate = true;

        if(me.pk && (e.altKey || e.ctrlKey || e.shiftKey || e.keyCode === 18 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 224 || e.keyCode === 91) ) {
            me.highlightlevel = me.pk;

            var bClick = true;
            me.rayCaster(e, bClick);
        }

        me.controls.handleResize();
        me.controls.update();
        me.render();
    });

    this.container.bind('touchstart', function (e) {
        e.preventDefault();
        me.isDragging = true;

        if (!me.scene) return;

        me.bStopRotate = true;

        $("[id$=popup]").hide();

        //var bClick = false;
        var bClick = true;
        me.rayCaster(e, bClick);

        me.controls.handleResize();
        me.controls.update();
        me.render();
    });

    this.container.bind('mousemove touchmove', function (e) {
        e.preventDefault();
        if (!me.scene) return;
        // no action when no mouse button is clicked and no key was down
        //if (!me.isDragging) return;

        $("[id$=popup]").hide();

        var bClick = false;
        me.rayCaster(e, bClick);

        if(me.isDragging) {
            me.controls.handleResize();
            me.controls.update();
            me.render();
        }
    });
    this.container.bind('mousewheel', function (e) {
        e.preventDefault();
        if (!me.scene) return;

        me.bStopRotate = true;

        me.controls.handleResize();
        me.controls.update();

        me.render();
    });
    this.container.bind('DOMMouseScroll', function (e) {
        e.preventDefault();
        if (!me.scene) return;

        me.bStopRotate = true;

        me.controls.handleResize();
        me.controls.update();

        me.render();
    });
};

iCn3D.prototype = {

    constructor: iCn3D,

    rayCaster: function(e, bClick) { var me = this;
        var x = e.pageX, y = e.pageY;
        if (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0]) {
            x = e.originalEvent.targetTouches[0].pageX;
            y = e.originalEvent.targetTouches[0].pageY;
        }

        var popupX = x - me.container.offset().left;
        var popupY = y - me.container.offset().top;

        //me.isDragging = true;

        // see ref http://soledadpenades.com/articles/three-js-tutorials/object-pk/
        //if(me.pk && (e.altKey || e.ctrlKey || e.shiftKey || e.keyCode === 18 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 224 || e.keyCode === 91) ) {
        //    me.highlightlevel = me.pk;

            me.mouse.x = ( (x - me.container.offset().left) / me.container.width() ) * 2 - 1;
            me.mouse.y = - ( (y - me.container.offset().top) / me.container.height() ) * 2 + 1;

            var mouse3 = new THREE.Vector3();
            mouse3.x = me.mouse.x;
            mouse3.y = me.mouse.y;
            //mouse3.z = 0.5;
            if(this.cam_z > 0) {
              mouse3.z = -1.0; // between -1 to 1. The z positio of mouse in the real world should be between the camera and the target."-1" worked in our case.
            }
            else {
              mouse3.z = 1.0; // between -1 to 1. The z positio of mouse in the real world should be between the camera and the target."-1" worked in our case.
            }

            // similar to setFromCamera() except mouse3.z is the opposite sign from the value in setFromCamera()
            if(me.cam === me.perspectiveCamera) { // perspective
                if(this.cam_z > 0) {
                  mouse3.z = -1.0;
                }
                else {
                  mouse3.z = 1.0;
                }
                //me.projector.unprojectVector( mouse3, me.cam );  // works for all versions
                mouse3.unproject(me.cam );  // works for all versions
                me.raycaster.set(me.cam.position, mouse3.sub(me.cam.position).normalize()); // works for all versions
            }
            else if(me.cam === me.orthographicCamera) {  // orthographics
                if(this.cam_z > 0) {
                  mouse3.z = 1.0;
                }
                else {
                  mouse3.z = -1.0;
                }
                //me.projector.unprojectVector( mouse3, me.cam );  // works for all versions
                mouse3.unproject(me.cam );  // works for all versions
                me.raycaster.set(mouse3, new THREE.Vector3(0,0,-1).transformDirection( me.cam.matrixWorld )); // works for all versions
            }

            var intersects = me.raycaster.intersectObjects( me.objects ); // not all "mdl" group will be used for pk

            var bFound = false;

            var position = me.mdl.position;
            if ( intersects.length > 0 ) {
                // the intersections are sorted so that the closest point is the first one.
                intersects[ 0 ].point.sub(position); // mdl.position was moved to the original (0,0,0) after reading the molecule coordinates. The raycasting was done based on the original. The positio of the ooriginal should be substracted.

                var threshold = 0.5;
                var atom = me.getAtomsFromPosition(intersects[ 0 ].point, threshold); // the second parameter is the distance threshold. The first matched atom will be returned. Use 1 angstrom, not 2 angstrom. If it's 2 angstrom, other atom will be returned.

                while(!atom && threshold < 10) {
                    threshold = threshold + 0.5;
                    atom = me.getAtomsFromPosition(intersects[ 0 ].point, threshold);
                }

                if(atom) {
                    bFound = true;
                    if(me.pickpair) {
                        if(bClick) {
                          if(me.pAtomNum % 2 === 0) {
                            me.pAtom = atom;
                          }
                          else {
                            me.pAtom2 = atom;
                          }

                          ++me.pAtomNum;
                        }
                    }
                    else {
                      me.pAtom = atom;
                    }

                    if(bClick) {
                      me.showPicking(atom);
                    }
                    else {
                      me.showPicking(atom, popupX, popupY);
                    }
                }
                else {
                    console.log("No atoms were found in 10 andstrom range");
                }
            } // end if

            if(!bFound) {
                intersects = me.raycaster.intersectObjects( me.objects_ghost ); // not all "mdl" group will be used for pk

                position = me.mdl_ghost.position;
                if ( intersects.length > 0 ) {
                    // the intersections are sorted so that the closest point is the first one.
                    intersects[ 0 ].point.sub(position); // mdl.position was moved to the original (0,0,0) after reading the molecule coordinates. The raycasting was done based on the original. The positio of the ooriginal should be substracted.

                    var threshold = 0.5;
                    var atom = me.getAtomsFromPosition(intersects[ 0 ].point, threshold); // the second parameter is the distance threshold. The first matched atom will be returned. Use 1 angstrom, not 2 angstrom. If it's 2 angstrom, other atom will be returned.

                    while(!atom && threshold < 10) {
                        threshold = threshold + 0.5;
                        atom = me.getAtomsFromPosition(intersects[ 0 ].point, threshold);
                    }

                    if(atom) {
                        if(me.pickpair) {
                            if(bClick) {
                              if(me.pAtomNum % 2 === 0) {
                                me.pAtom = atom;
                              }
                              else {
                                me.pAtom2 = atom;
                              }

                              ++me.pAtomNum;
                            }
                        }
                        else {
                          me.pAtom = atom;
                        }

                        if(bClick) {
                          me.showPicking(atom);
                        }
                        else {
                          me.showPicking(atom, popupX, popupY);
                        }
                    }
                    else {
                        console.log("No atoms were found in 10 andstrom range");
                    }
                } // end if
            }
        //}
    },

    setRotation: function(axis, angle) { var me = this;
          axis.applyQuaternion( me.cam.quaternion ).normalize();

          var quaternion = new THREE.Quaternion();
          quaternion.setFromAxisAngle( axis, -angle );

          var para = {};
          para.quaternion = quaternion;
          para.update = true;

          me.controls.update(para);
          me.render();
    },

    setOutlineColor: function(colorStr) {
        // outline using ShaderMaterial: http://jsfiddle.net/Eskel/g593q/9/
        var shader = {
            'outline' : {
                vertex_shader: [
                    "uniform float offset;",
                    "void main() {",
                        "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
                        "gl_Position = projectionMatrix * pos;",
                    "}"
                ].join("\n"),

                fragment_shader: [
                    "void main(){",
                        "gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );",
                    "}"
                ].join("\n")
            }
        };

        if(colorStr === 'yellow') {
           shader.outline.fragment_shader = [
               "void main(){",
                   "gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );",
               "}"
           ].join("\n");
        }
        else if(colorStr === 'green') {
           shader.outline.fragment_shader = [
               "void main(){",
                   "gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );",
               "}"
           ].join("\n");
        }
        else if(colorStr === 'red') {
           shader.outline.fragment_shader = [
               "void main(){",
                   "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",
               "}"
           ].join("\n");
        }

        // shader
        var uniforms = {offset: {
            type: "f",
            //value: 1
            value: 0.5
          }
        };

        var outShader = shader['outline'];

        var matShader = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: outShader.vertex_shader,
            fragmentShader: outShader.fragment_shader,
            depthTest: false,
            depthWrite: false,
            needsUpdate: true
        });

        return matShader;
    },

    // modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
    setWidthHeight: function(width, height) {
        //this.renderer.setSize(width, height);

        //antialiasing by render twice large:
        //https://stackoverflow.com/questions/17224795/antialiasing-not-working-in-three-js
        this.renderer.setSize(width*this.scaleFactor, height*this.scaleFactor);
        this.renderer.domElement.style.width = width + "px";
        this.renderer.domElement.style.height = height + "px";
        this.renderer.domElement.width = width*this.scaleFactor;
        this.renderer.domElement.height = height*this.scaleFactor;

        this.container.widthInv  = 1 / (this.scaleFactor*width);
        this.container.heightInv = 1 / (this.scaleFactor*height);
        this.container.whratio = width / height;
    },

    // added nucleotides and ions
    nucleotidesArray: ['  G', '  A', '  T', '  C', '  U', ' DG', ' DA', ' DT', ' DC', ' DU'],

    ionsArray: ['  K', ' NA', ' MG', ' AL', ' CA', ' TI', ' MN', ' FE', ' NI', ' CU', ' ZN', ' AG', ' BA', '  F', ' CL', ' BR', '  I'],

    vdwRadii: { // Hu, S.Z.; Zhou, Z.H.; Tsai, K.R. Acta Phys.-Chim. Sin., 2003, 19:1073.
         H: 1.08,
        HE: 1.34,
        LI: 1.75,
        BE: 2.05,
         B: 1.47,
         C: 1.49,
         N: 1.41,
         O: 1.40,
         F: 1.39,
        NE: 1.68,
        NA: 1.84,
        MG: 2.05,
        AL: 2.11,
        SI: 2.07,
         P: 1.92,
         S: 1.82,
        CL: 1.83,
        AR: 1.93,
         K: 2.05,
        CA: 2.21,
        SC: 2.16,
        TI: 1.87,
         V: 1.79,
        CR: 1.89,
        MN: 1.97,
        FE: 1.94,
        CO: 1.92,
        NI: 1.84,
        CU: 1.86,
        ZN: 2.10,
        GA: 2.08,
        GE: 2.15,
        AS: 2.06,
        SE: 1.93,
        BR: 1.98,
        KR: 2.12,
        RB: 2.16,
        SR: 2.24,
         Y: 2.19,
        ZR: 1.86,
        NB: 2.07,
        MO: 2.09,
        TC: 2.09,
        RU: 2.07,
        RH: 1.95,
        PD: 2.02,
        AG: 2.03,
        CD: 2.30,
        IN: 2.36,
        SN: 2.33,
        SB: 2.25,
        TE: 2.23,
         I: 2.23,
        XE: 2.21,
        CS: 2.22,
        BA: 2.51,
        LA: 2.40,
        CE: 2.35,
        PR: 2.39,
        ND: 2.29,
        PM: 2.36,
        SM: 2.29,
        EU: 2.33,
        GD: 2.37,
        TB: 2.21,
        DY: 2.29,
        HO: 2.16,
        ER: 2.35,
        TM: 2.27,
        YB: 2.42,
        LU: 2.21,
        HF: 2.12,
        TA: 2.17,
         W: 2.10,
        RE: 2.17,
        OS: 2.16,
        IR: 2.02,
        PT: 2.09,
        AU: 2.17,
        HG: 2.09,
        TL: 2.35,
        PB: 2.32,
        BI: 2.43,
        PO: 2.29,
        AT: 2.36,
        RN: 2.43,
        FR: 2.56,
        RA: 2.43,
        AC: 2.60,
        TH: 2.37,
        PA: 2.43,
         U: 2.40,
        NP: 2.21,
        PU: 2.56,
        AM: 2.56,
        CM: 2.56,
        BK: 2.56,
        CF: 2.56,
        ES: 2.56,
        FM: 2.56,
    },

    covalentRadii: { // http://en.wikipedia.org/wiki/Covalent_radius
         H: 0.31,
        HE: 0.28,
        LI: 1.28,
        BE: 0.96,
         B: 0.84,
         C: 0.76,
         N: 0.71,
         O: 0.66,
         F: 0.57,
        NE: 0.58,
        NA: 1.66,
        MG: 1.41,
        AL: 1.21,
        SI: 1.11,
         P: 1.07,
         S: 1.05,
        CL: 1.02,
        AR: 1.06,
         K: 2.03,
        CA: 1.76,
        SC: 1.70,
        TI: 1.60,
         V: 1.53,
        CR: 1.39,
        MN: 1.39,
        FE: 1.32,
        CO: 1.26,
        NI: 1.24,
        CU: 1.32,
        ZN: 1.22,
        GA: 1.22,
        GE: 1.20,
        AS: 1.19,
        SE: 1.20,
        BR: 1.20,
        KR: 1.16,
        RB: 2.20,
        SR: 1.95,
         Y: 1.90,
        ZR: 1.75,
        NB: 1.64,
        MO: 1.54,
        TC: 1.47,
        RU: 1.46,
        RH: 1.42,
        PD: 1.39,
        AG: 1.45,
        CD: 1.44,
        IN: 1.42,
        SN: 1.39,
        SB: 1.39,
        TE: 1.38,
         I: 1.39,
        XE: 1.40,
        CS: 2.44,
        BA: 2.15,
        LA: 2.07,
        CE: 2.04,
        PR: 2.03,
        ND: 2.01,
        PM: 1.99,
        SM: 1.98,
        EU: 1.98,
        GD: 1.96,
        TB: 1.94,
        DY: 1.92,
        HO: 1.92,
        ER: 1.89,
        TM: 1.90,
        YB: 1.87,
        LU: 1.87,
        HF: 1.75,
        TA: 1.70,
         W: 1.62,
        RE: 1.51,
        OS: 1.44,
        IR: 1.41,
        PT: 1.36,
        AU: 1.36,
        HG: 1.32,
        TL: 1.45,
        PB: 1.46,
        BI: 1.48,
        PO: 1.40,
        AT: 1.50,
        RN: 1.50,
        FR: 2.60,
        RA: 2.21,
        AC: 2.15,
        TH: 2.06,
        PA: 2.00,
         U: 1.96,
        NP: 1.90,
        PU: 1.87,
        AM: 1.80,
        CM: 1.69,
    },

    //rasmol-like element colors
    atomColors: {
        'H': new THREE.Color(0xFFFFFF),
        'He': new THREE.Color(0xFFC0CB),
        'HE': new THREE.Color(0xFFC0CB),
        'Li': new THREE.Color(0xB22222),
        'LI': new THREE.Color(0xB22222),
        'B': new THREE.Color(0x00FF00),
        'C': new THREE.Color(0xC8C8C8),
        'N': new THREE.Color(0x8F8FFF),
        'O': new THREE.Color(0xF00000),
        'F': new THREE.Color(0xDAA520),
        'Na': new THREE.Color(0x0000FF),
        'NA': new THREE.Color(0x0000FF),
        'Mg': new THREE.Color(0x228B22),
        'MG': new THREE.Color(0x228B22),
        'Al': new THREE.Color(0x808090),
        'AL': new THREE.Color(0x808090),
        'Si': new THREE.Color(0xDAA520),
        'SI': new THREE.Color(0xDAA520),
        'P': new THREE.Color(0xFFA500),
        'S': new THREE.Color(0xFFC832),
        'Cl': new THREE.Color(0x00FF00),
        'CL': new THREE.Color(0x00FF00),
        'Ca': new THREE.Color(0x808090),
        'CA': new THREE.Color(0x808090),
        'Ti': new THREE.Color(0x808090),
        'TI': new THREE.Color(0x808090),
        'Cr': new THREE.Color(0x808090),
        'CR': new THREE.Color(0x808090),
        'Mn': new THREE.Color(0x808090),
        'MN': new THREE.Color(0x808090),
        'Fe': new THREE.Color(0xFFA500),
        'FE': new THREE.Color(0xFFA500),
        'Ni': new THREE.Color(0xA52A2A),
        'NI': new THREE.Color(0xA52A2A),
        'Cu': new THREE.Color(0xA52A2A),
        'CU': new THREE.Color(0xA52A2A),
        'Zn': new THREE.Color(0xA52A2A),
        'ZN': new THREE.Color(0xA52A2A),
        'Br': new THREE.Color(0xA52A2A),
        'BR': new THREE.Color(0xA52A2A),
        'Ag': new THREE.Color(0x808090),
        'AG': new THREE.Color(0x808090),
        'I': new THREE.Color(0xA020F0),
        'Ba': new THREE.Color(0xFFA500),
        'BA': new THREE.Color(0xFFA500),
        'Au': new THREE.Color(0xDAA520),
        'AU': new THREE.Color(0xDAA520)
    },

    defaultAtomColor: new THREE.Color(0xCCCCCC),

    stdChainColors: [
            // first 6 colors from MMDB
            new THREE.Color(0xFF00FF),
            new THREE.Color(0x0000FF),
            new THREE.Color(0x996633),
            new THREE.Color(0x00FF99),
            new THREE.Color(0xFF9900),
            new THREE.Color(0xFF6666),

            new THREE.Color(0x32CD32),
            new THREE.Color(0x1E90FF),
            new THREE.Color(0xFA8072),
            new THREE.Color(0xFFA500),
            new THREE.Color(0x00CED1),
            new THREE.Color(0xFF69B4),

            new THREE.Color(0x00FF00),
            new THREE.Color(0x0000FF),
            new THREE.Color(0xFF0000),
            new THREE.Color(0xFFFF00),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xFF00FF),

            new THREE.Color(0x3CB371),
            new THREE.Color(0x4682B4),
            new THREE.Color(0xCD5C5C),
            new THREE.Color(0xFFE4B5),
            new THREE.Color(0xAFEEEE),
            new THREE.Color(0xEE82EE),

            new THREE.Color(0x006400),
            new THREE.Color(0x00008B),
            new THREE.Color(0x8B0000),
            new THREE.Color(0xCD853F),
            new THREE.Color(0x008B8B),
            new THREE.Color(0x9400D3)
        ],

    backgroundColors: {
        black: new THREE.Color(0x000000),
         grey: new THREE.Color(0xCCCCCC),
        white: new THREE.Color(0xFFFFFF),
        transparent: new THREE.Color(0x000000)
    },

    residueColors: {
        ALA: new THREE.Color(0xC8C8C8),
        ARG: new THREE.Color(0x145AFF),
        ASN: new THREE.Color(0x00DCDC),
        ASP: new THREE.Color(0xE60A0A),
        CYS: new THREE.Color(0xE6E600),
        GLN: new THREE.Color(0x00DCDC),
        GLU: new THREE.Color(0xE60A0A),
        GLY: new THREE.Color(0xEBEBEB),
        HIS: new THREE.Color(0x8282D2),
        ILE: new THREE.Color(0x0F820F),
        LEU: new THREE.Color(0x0F820F),
        LYS: new THREE.Color(0x145AFF),
        MET: new THREE.Color(0xE6E600),
        PHE: new THREE.Color(0x3232AA),
        PRO: new THREE.Color(0xDC9682),
        SER: new THREE.Color(0xFA9600),
        THR: new THREE.Color(0xFA9600),
        TRP: new THREE.Color(0xB45AB4),
        TYR: new THREE.Color(0x3232AA),
        VAL: new THREE.Color(0x0F820F),
        ASX: new THREE.Color(0xFF69B4),
        GLX: new THREE.Color(0xFF69B4),
          'G': new THREE.Color(0x008000),
          'A': new THREE.Color(0x6080FF),
          'T': new THREE.Color(0xFF8000),
          'C': new THREE.Color(0xFF0000),
          'U': new THREE.Color(0xFF8000),
         'DG': new THREE.Color(0x008000),
         'DA': new THREE.Color(0x6080FF),
         'DT': new THREE.Color(0xFF8000),
         'DC': new THREE.Color(0xFF0000),
         'DU': new THREE.Color(0xFF8000)
    },

    defaultResidueColor: new THREE.Color(0xBEA06E),

    chargeColors: {
// charged residues
        '  G': new THREE.Color(0xFF0000),
        '  A': new THREE.Color(0xFF0000),
        '  T': new THREE.Color(0xFF0000),
        '  C': new THREE.Color(0xFF0000),
        '  U': new THREE.Color(0xFF0000),
        ' DG': new THREE.Color(0xFF0000),
        ' DA': new THREE.Color(0xFF0000),
        ' DT': new THREE.Color(0xFF0000),
        ' DC': new THREE.Color(0xFF0000),
        ' DU': new THREE.Color(0xFF0000),
          'G': new THREE.Color(0xFF0000),
          'A': new THREE.Color(0xFF0000),
          'T': new THREE.Color(0xFF0000),
          'C': new THREE.Color(0xFF0000),
          'U': new THREE.Color(0xFF0000),
         'DG': new THREE.Color(0xFF0000),
         'DA': new THREE.Color(0xFF0000),
         'DT': new THREE.Color(0xFF0000),
         'DC': new THREE.Color(0xFF0000),
         'DU': new THREE.Color(0xFF0000),
        'ARG': new THREE.Color(0x0000FF),
        'LYS': new THREE.Color(0x0000FF),
        'ASP': new THREE.Color(0xFF0000),
        'GLU': new THREE.Color(0xFF0000),

// hydrophobic
        'GLY': new THREE.Color(0x888888),
        'PRO': new THREE.Color(0x888888),
        'ALA': new THREE.Color(0x888888),
        'VAL': new THREE.Color(0x888888),
        'LEU': new THREE.Color(0x888888),
        'ILE': new THREE.Color(0x888888),
        'PHE': new THREE.Color(0x888888),

// polar
        'HIS': new THREE.Color(0x888888),
        'SER': new THREE.Color(0x888888),
        'THR': new THREE.Color(0x888888),
        'ASN': new THREE.Color(0x888888),
        'GLN': new THREE.Color(0x888888),
        'TYR': new THREE.Color(0x888888),
        'MET': new THREE.Color(0x888888),
        'CYS': new THREE.Color(0x888888),
        'TRP': new THREE.Color(0x888888)
    },

    hydrophobicColors: {
// charged residues
        '  G': new THREE.Color(0x888888),
        '  A': new THREE.Color(0x888888),
        '  T': new THREE.Color(0x888888),
        '  C': new THREE.Color(0x888888),
        '  U': new THREE.Color(0x888888),
        ' DG': new THREE.Color(0x888888),
        ' DA': new THREE.Color(0x888888),
        ' DT': new THREE.Color(0x888888),
        ' DC': new THREE.Color(0x888888),
        ' DU': new THREE.Color(0x888888),
          'G': new THREE.Color(0x888888),
          'A': new THREE.Color(0x888888),
          'T': new THREE.Color(0x888888),
          'C': new THREE.Color(0x888888),
          'U': new THREE.Color(0x888888),
         'DG': new THREE.Color(0x888888),
         'DA': new THREE.Color(0x888888),
         'DT': new THREE.Color(0x888888),
         'DC': new THREE.Color(0x888888),
         'DU': new THREE.Color(0x888888),
        'ARG': new THREE.Color(0x888888),
        'LYS': new THREE.Color(0x888888),
        'ASP': new THREE.Color(0x888888),
        'GLU': new THREE.Color(0x888888),

// hydrophobic
        'GLY': new THREE.Color(0x00FF00),
        'PRO': new THREE.Color(0x00FF00),
        'ALA': new THREE.Color(0x00FF00),
        'VAL': new THREE.Color(0x00FF00),
        'LEU': new THREE.Color(0x00FF00),
        'ILE': new THREE.Color(0x00FF00),
        'PHE': new THREE.Color(0x00FF00),

// polar
        'HIS': new THREE.Color(0x888888),
        'SER': new THREE.Color(0x888888),
        'THR': new THREE.Color(0x888888),
        'ASN': new THREE.Color(0x888888),
        'GLN': new THREE.Color(0x888888),
        'TYR': new THREE.Color(0x888888),
        'MET': new THREE.Color(0x888888),
        'CYS': new THREE.Color(0x888888),
        'TRP': new THREE.Color(0x888888)
    },

    sheetcolor: 'green',

    ssColors: {
        //helix: new THREE.Color(0xFF0080),
        helix: new THREE.Color(0xFF0000),
        //sheet: new THREE.Color(0xFFC800),
        sheet: new THREE.Color(0x008000),
         coil: new THREE.Color(0x6080FF)
    },

    ssColors2: {
        //helix: new THREE.Color(0xFF0080),
        helix: new THREE.Color(0xFF0000),
        sheet: new THREE.Color(0xFFC800),
        //sheet: new THREE.Color(0x008000),
         coil: new THREE.Color(0x6080FF)
    },

    //defaultBondColor: new THREE.Color(0x2194D6),
    defaultBondColor: new THREE.Color(0xBBBBBB), // cross residue bonds

    surfaces: {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined
    },

    mapData: {},

    // from iview (http://istar.cse.cuhk.edu.hk/iview/)
    hasCovalentBond: function (atom0, atom1) {
        var r = this.covalentRadii[atom0.elem] + this.covalentRadii[atom1.elem];
        return atom0.coord.distanceToSquared(atom1.coord) < 1.3 * r * r;
    },

    init_base: function () {
        this.structures = {}; // structure name -> array of chains
        this.chains = {}; // structure_chain name -> atom hash
        this.residues = {}; // structure_chain_resi name -> atom hash
        this.secondaries = {}; // structure_chain_resi name -> secondary structure: 'c', 'H', or 'E'
        this.alnChains = {}; // structure_chain name -> atom hash

        this.chainsSeq = {}; // structure_chain name -> array of sequence
        this.chainsColor = {}; // structure_chain name -> color, show chain color in sequence display for mmdbid and align input
        this.chainsGene = {}; // structure_chain name -> gene, show chain gene symbol in sequence display for mmdbid and align input
        this.chainsAn = {}; // structure_chain name -> array of annotations, such as residue number
        this.chainsAnTitle = {}; // structure_chain name -> array of annotation title

        this.alnChainsSeq = {}; // structure_chain name -> array of residue object: {mmdbid, chain, resi, resn, aligned}
        this.alnChainsAnno = {}; // structure_chain name -> array of annotations, such as residue number
        this.alnChainsAnTtl = {}; // structure_chain name -> array of annotation title

        this.dAtoms = {}; // show selected atoms
        this.hAtoms = {}; // used to change color or dislay type for certain atoms

        this.pickedAtomList = {}; // used to switch among different highlight levels

        this.prevHighlightObjects = [];
        this.prevHighlightObjects_ghost = [];
        this.prevSurfaces = [];
        this.prevMaps = [];
        this.prevEmmaps = [];

        this.defNames2Residues = {}; // custom defined selection name -> residue array
        this.defNames2Atoms = {}; // custom defined selection name -> atom array
        this.defNames2Descr = {}; // custom defined selection name -> description
        this.defNames2Command = {}; // custom defined selection name -> command

        this.residueId2Name = {}; // structure_chain_resi -> one letter abbreviation

        this.atoms = {};
        this.dAtoms = {};
        this.hAtoms = {};
        this.proteins = {};
        this.sidec = {};
        this.nucleotides = {};
        this.nucleotidesO3 = {};

        this.chemicals = {};
        this.ions = {};
        this.water = {};
        this.calphas = {};

        this.hbondpnts = [];
        this.stabilizerpnts = [];
        //this.ncbondpnts = []; // non-covalent bonds

        this.doublebonds = {};
        this.triplebonds = {};
        this.aromaticbonds = {};

        this.atomPrevColors = {};

        this.style2atoms = {}; // style -> atom hash, 13 styles: ribbon, strand, cylinder and plate, nucleotide cartoon, o3 trace, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, dot, nothing
        this.labels = {};     // hash of name -> a list of labels. Each label contains 'position', 'text', 'size', 'color', 'background'
                            // label name could be custom, residue, schmatic, distance
        this.lines = {};     // hash of name -> a list of solid or dashed lines. Each line contains 'position1', 'position2', 'color', and a boolean of 'dashed'
                            // line name could be custom, hbond, ssbond, distance

        this.rotateCount = 0;
        this.rotateCountMax = 20;
    },

    init: function () {
        this.init_base();

        this.molTitle = "";

        this.ssbondpnts = {}; // disulfide bonds for each structure

        this.inputid = {"idtype": undefined, "id":undefined}; // support pdbid, mmdbid

        this.biomtMatrices = [];
        this.bAssembly = true;

        this.bDrawn = false;
        this.bSecondaryStructure = false;
        this.bHighlight = 1; // undefined: no highlight, 1: highlight by outline, 2: highlight by 3D object
    },

    reinitAfterLoad: function () {
        this.dAtoms = this.cloneHash(this.atoms); // show selected atoms
        this.hAtoms = this.cloneHash(this.atoms); // used to change color or dislay type for certain atoms

        this.prevHighlightObjects = [];
        this.prevHighlightObjects_ghost = [];
        this.prevSurfaces = [];
        this.prevMaps = [];
        this.prevEmmaps = [];

        this.labels = {};   // hash of name -> a list of labels. Each label contains 'position', 'text', 'size', 'color', 'background'
                            // label name could be custom, residue, schmatic, distance
        this.lines = {};    // hash of name -> a list of solid or dashed lines. Each line contains 'position1', 'position2', 'color', and a boolean of 'dashed'
                            // line name could be custom, hbond, ssbond, distance

        this.bAssembly = true;
    }
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.loadPDB = function (src) {
    var helices = [], sheets = [];
    //this.atoms = {};
    var lines = src.split('\n');

    var chainsTmp = {}; // serial -> atom
    var residuesTmp = {}; // serial -> atom

    this.init();

    var sheetArray = [], sheetStart = [], sheetEnd = [], helixArray = [], helixStart = [], helixEnd = [];

    // Concatenation of two pdbs will have several atoms for the same serial
    var serial = 0;

    var moleculeNum = 1;
    var chainNum, residueNum, oriResidueNum;
    var prevChainNum = '', prevResidueNum = '', prevOriResidueNum = '', prevResi = 0;
    var prevRecord = '';
    var bModifyResi = false;

    var oriSerial2NewSerial = {};

    var chainMissingResidueArray = {};

    var id = 'stru';

    var maxMissingResi = 0, prevMissingChain = '';

    for (var i in lines) {
        var line = lines[i];
        var record = line.substr(0, 6);

        if (record === 'HEADER') {
            id = line.substr(62, 4);

            this.molTitle = '';

        } else if (record === 'TITLE ') {
            var name = line.substr(10);
            this.molTitle += name.trim() + " ";

        } else if (record === 'HELIX ') {
            this.bSecondaryStructure = true;

            var startChain = line.substr(19, 1);
            var startResi = parseInt(line.substr(21, 4));
            var endResi = parseInt(line.substr(33, 4));

            var chain_resi;
            for(var j = startResi; j <= endResi; ++j) {
              chain_resi = startChain + "_" + j;
              helixArray.push(chain_resi);

              if(j === startResi) helixStart.push(chain_resi);
              if(j === endResi) helixEnd.push(chain_resi);
            }

            helices.push({
                chain: startChain,
                initialResidue: startResi,
                initialInscode: line.substr(25, 1),
                terminalResidue: endResi,
                terminalInscode: line.substr(37, 1),
            });
        } else if (record === 'SHEET ') {
            this.bSecondaryStructure = true;

            var startChain = line.substr(21, 1);
            var startResi = parseInt(line.substr(22, 4));
            var endResi = parseInt(line.substr(33, 4));

            for(var j = startResi; j <= endResi; ++j) {
              var chain_resi = startChain + "_" + j;
              sheetArray.push(chain_resi);

              if(j === startResi) sheetStart.push(chain_resi);
              if(j === endResi) sheetEnd.push(chain_resi);
            }

            sheets.push({
                chain: startChain,
                initialResidue: startResi,
                initialInscode: line.substr(26, 1),
                terminalResidue: endResi,
                terminalInscode: line.substr(37, 1),
            });

        } else if (record === 'HBOND ') {
/*
            //HBOND A 1536   N2 A   59  ND2  -19.130  83.151  52.266 -18.079  81.613  49.427    3.40
            bCalculateHbond = false;

            var chemicalChain = line.substr(6, 1);
            var chemicalResi = line.substr(8, 4).replace(/ /g, "");
            var chemicalAtom = line.substr(14, 4).replace(/ /g, "");
            var proteinChain = line.substr(18, 1);
            var proteinResi = line.substr(20, 4).replace(/ /g, "");
            var proteinAtom = line.substr(25, 4).replace(/ /g, "");

            var chemical_x = parseFloat(line.substr(30, 8));
            var chemical_y = parseFloat(line.substr(38, 8));
            var chemical_z = parseFloat(line.substr(46, 8));
            var protein_x = parseFloat(line.substr(54, 8));
            var protein_y = parseFloat(line.substr(62, 8));
            var protein_z = parseFloat(line.substr(70, 8));

            var dist = line.substr(78, 8).replace(/ /g, "");

            this.hbondpnts.push(new THREE.Vector3(chemical_x, chemical_y, chemical_z));
            this.hbondpnts.push(new THREE.Vector3(protein_x, protein_y, protein_z));
*/
        } else if (record === 'SSBOND') {
            //SSBOND   1 CYS E   48    CYS E   51                          2555
            var chain1 = line.substr(15, 1);
            var resi1 = line.substr(17, 4).replace(/ /g, "");
            var resid1 = id + '_' + chain1 + '_' + resi1;

            var chain2 = line.substr(29, 1);
            var resi2 = line.substr(31, 4).replace(/ /g, "");
            var resid2 = id + '_' + chain2 + '_' + resi2;

            if(this.ssbondpnts[id] === undefined) this.ssbondpnts[id] = [];

            this.ssbondpnts[id].push(resid1);
            this.ssbondpnts[id].push(resid2);
        } else if (record === 'REMARK') {
             var type = parseInt(line.substr(7, 3));
             // from GLMol
             if (type == 350 && line.substr(13, 5) == 'BIOMT') {
                var n = parseInt(line[18]) - 1;
                //var m = parseInt(line.substr(21, 2));
                var m = parseInt(line.substr(21, 2)) - 1; // start from 1
                if (this.biomtMatrices[m] == undefined) this.biomtMatrices[m] = new THREE.Matrix4().identity();
                this.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
                this.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                this.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                this.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
             }
             // missing residues
             else if (type == 465 && line.substr(18, 1) == ' ' && line.substr(20, 1) == ' ' && line.substr(21, 1) != 'S') {
                var resn = line.substr(15, 3);
                var chain = line.substr(19, 1);
                var resi = parseInt(line.substr(21, 5));

                //var structure = parseInt(line.substr(13, 1));
                //if(line.substr(13, 1) == ' ') structure = 1;

                //var chainNum = structure + '_' + chain;
                var chainNum = id + '_' + chain;

                if(chainMissingResidueArray[chainNum] === undefined) chainMissingResidueArray[chainNum] = [];
                var resObject = {};
                resObject.resi = resi;
                resObject.name = this.residueName2Abbr(resn).toLowerCase();

                if(chain != prevMissingChain) {
                    maxMissingResi = 0;
                }

                // not all listed residues are considered missing, e.g., PDB ID 4OR2, only the firts four residues are considered missing
                if(!isNaN(resi) && (prevMissingChain == '' || (chain != prevMissingChain) || (chain == prevMissingChain && resi > maxMissingResi)) ) {
                    chainMissingResidueArray[chainNum].push(resObject);

                    maxMissingResi = resi;
                    prevMissingChain = chain;
                }

             }
             else if (type == 900 && this.emd === undefined && line.substr(34).trim() == 'RELATED DB: EMDB') {
                 //REMARK 900 RELATED ID: EMD-3906   RELATED DB: EMDB
                 this.emd = line.substr(23, 11).trim();
             }
        } else if (record === 'ENDMDL') {
            ++moleculeNum;
        } else if (record === 'JRNL  ') {
            if(line.substr(12, 4) === 'PMID') {
                this.pmid = line.substr(19).trim();
            }
        } else if (record === 'ATOM  ' || record === 'HETATM') {
            var structure = (moleculeNum === 1) ? id : id + moleculeNum.toString();

            var alt = line.substr(16, 1);
            //if (alt !== " " && alt !== "A") continue;

            // "CA" has to appear before "O". Otherwise the cartoon of secondary structure will have breaks
            // Concatenation of two pdbs will have several atoms for the same serial
            ++serial;

            var serial2 = parseInt(line.substr(6, 5));
            oriSerial2NewSerial[serial2] = serial;

            var elem = line.substr(76, 2).replace(/ /g, "");
            if (elem === '') { // for some incorrect PDB files
               elem = line.substr(12, 2).replace(/ /g,"");
            }

            var chain = line.substr(21, 1);
            if(chain === '') chain = 1;

            chainNum = structure + "_" + chain;
            if(chainNum !== prevChainNum) {
                prevResi = 0;
                bModifyResi = false;
            }

            //var oriResi = line.substr(22, 4).trim();
            var oriResi = line.substr(22, 5).trim();
            oriResidueNum = chainNum + "_" + oriResi;
            //if(oriResidueNum !== prevOriResidueNum) {
            //    if(bModifyResi) {
            //      ++prevResi;
            //    }
            //    else {
            //      prevResi = (chainNum !== prevChainNum) ? 0 : parseInt(prevResidueNum.substr(prevResidueNum.lastIndexOf("_") + 1));
            //    }
            //}

            var resi = parseInt(oriResi);
            if(oriResi != resi || bModifyResi) { // e.g., 99A and 99
              bModifyResi = true;
              //resi = (prevResi == 0) ? resi : prevResi + 1;
            }

            residueNum = chainNum + "_" + resi;

            var atom = line.substr(12, 4).replace(/ /g, '');
            var chain_resi = chain + "_" + resi;

            var x = parseFloat(line.substr(30, 8));
            var y = parseFloat(line.substr(38, 8));
            var z = parseFloat(line.substr(46, 8));
            var resn = line.substr(17, 3);
            var coord = new THREE.Vector3(x, y, z);

            var atomDetails = {
                het: record[0] === 'H', // optional, used to determine chemicals, water, ions, etc
                serial: serial,         // required, unique atom id
                name: atom,             // required, atom name
                alt: alt,               // optional, some alternative coordinates
                resn: resn,             // optional, used to determine protein or nucleotide
                structure: structure,   // optional, used to identify structure
                chain: chain,           // optional, used to identify chain
                resi: resi,             // optional, used to identify residue ID
                //insc: line.substr(26, 1),
                coord: coord,           // required, used to draw 3D shape
                b: parseFloat(line.substr(60, 8)), // optional, used to draw B-factor tube
                elem: elem,             // optional, used to determine hydrogen bond
                bonds: [],              // required, used to connect atoms
                ss: 'coil',             // optional, used to show secondary structures
                ssbegin: false,         // optional, used to show the beginning of secondary structures
                ssend: false            // optional, used to show the end of secondary structures
            };

            this.atoms[serial] = atomDetails;

            this.dAtoms[serial] = 1;
            this.hAtoms[serial] = 1;

            // Assign secondary structures from the input
            // if a residue is assigned both sheet and helix, it is assigned as sheet
            if($.inArray(chain_resi, sheetArray) !== -1) {
              this.atoms[serial].ss = 'sheet';

              if($.inArray(chain_resi, sheetStart) !== -1) {
                this.atoms[serial].ssbegin = true;
              }

              // do not use else if. Some residues are both start and end of secondary structure
              if($.inArray(chain_resi, sheetEnd) !== -1) {
                this.atoms[serial].ssend = true;
              }
            }
            else if($.inArray(chain_resi, helixArray) !== -1) {
              this.atoms[serial].ss = 'helix';

              if($.inArray(chain_resi, helixStart) !== -1) {
                this.atoms[serial].ssbegin = true;
              }

              // do not use else if. Some residues are both start and end of secondary structure
              if($.inArray(chain_resi, helixEnd) !== -1) {
                this.atoms[serial].ssend = true;
              }
            }

            var secondaries = '-';
            if(this.atoms[serial].ss === 'helix') {
                secondaries = 'H';
            }
            else if(this.atoms[serial].ss === 'sheet') {
                secondaries = 'E';
            }
            //else if(this.atoms[serial].ss === 'coil') {
            //    secondaries = 'c';
            //}
            else if(!this.atoms[serial].het && this.residueColors.hasOwnProperty(this.atoms[serial].resn.toUpperCase()) ) {
                secondaries = 'c';
            }
            else {
                secondaries = 'o';
            }

            this.secondaries[residueNum] = secondaries;

            // different residue
            //if(residueNum !== prevResidueNum) {
            if(oriResidueNum !== prevOriResidueNum) {
                var residue = this.residueName2Abbr(resn);

                this.residueId2Name[residueNum] = residue;

                if(serial !== 1) this.residues[prevResidueNum] = residuesTmp;

                if(residueNum !== prevResidueNum) {
                    residuesTmp = {};
                }

                // different chain
                if(chainNum !== prevChainNum) {
                    // a chain could be separated in two sections
                    if(serial !== 1) {
                        //this.chains[prevChainNum] = this.unionHash2Atoms(this.chains[prevChainNum], chainsTmp);
                        this.chains[prevChainNum] = this.unionHash(this.chains[prevChainNum], chainsTmp);
                    }

                    chainsTmp = {};

                    if(this.structures[structure.toString()] === undefined) this.structures[structure.toString()] = [];
                    this.structures[structure.toString()].push(chainNum);

                    if(this.chainsSeq[chainNum] === undefined) this.chainsSeq[chainNum] = [];
/*
                    if(this.chainsAn[chainNum] === undefined ) this.chainsAn[chainNum] = [];
                    if(this.chainsAn[chainNum][0] === undefined ) this.chainsAn[chainNum][0] = [];
                    if(this.chainsAn[chainNum][1] === undefined ) this.chainsAn[chainNum][1] = [];
                    if(this.chainsAnTitle[chainNum] === undefined ) this.chainsAnTitle[chainNum] = [];
                    if(this.chainsAnTitle[chainNum][0] === undefined ) this.chainsAnTitle[chainNum][0] = [];
                    if(this.chainsAnTitle[chainNum][1] === undefined ) this.chainsAnTitle[chainNum][1] = [];
*/
                      var resObject = {};
                      resObject.resi = resi;
                      resObject.name = residue;

                    this.chainsSeq[chainNum].push(resObject);

/*
                      var numberStr = '';
                      if(resi % 10 === 0) numberStr = resi.toString();

                    this.chainsAn[chainNum][0].push(numberStr);
                    this.chainsAn[chainNum][1].push(secondaries);
                    this.chainsAnTitle[chainNum][0].push("");
                    this.chainsAnTitle[chainNum][1].push("SS");
*/
                }
                else {
                      var resObject = {};
                      resObject.resi = resi;
                      resObject.name = residue;

                    this.chainsSeq[chainNum].push(resObject);

/*
                      var numberStr = '';
                      if(resi % 10 === 0) numberStr = resi.toString();

                    this.chainsAn[chainNum][0].push(numberStr);
                    this.chainsAn[chainNum][1].push(secondaries);
*/
                }
            }

            chainsTmp[serial] = 1;
            residuesTmp[serial] = 1;

            prevRecord = record;

            prevChainNum = chainNum;
            prevResidueNum = residueNum;
            prevOriResidueNum = oriResidueNum;

        } else if (record === 'CONECT') {
            var from = parseInt(line.substr(6, 5));
            for (var j = 0; j < 4; ++j) {
                var to = parseInt(line.substr([11, 16, 21, 26][j], 5));
                if (isNaN(to)) continue;

                if(this.atoms[oriSerial2NewSerial[from]] !== undefined) this.atoms[oriSerial2NewSerial[from]].bonds.push(oriSerial2NewSerial[to]);
            }
        } else if (record.substr(0,3) === 'TER') {
            // Concatenation of two pdbs will have several atoms for the same serial
            ++serial;
        }
    }

    // copy disulfide bonds
    var structureArray = Object.keys(this.structures);
    for(var s = 0, sl = structureArray.length; s < sl; ++s) {
        var structure = structureArray[s];

        if(structure == id) continue;

        if(this.ssbondpnts[structure] === undefined) this.ssbondpnts[structure] = [];

        if(this.ssbondpnts[id] !== undefined) {
            for(var j = 0, jl = this.ssbondpnts[id].length; j < jl; ++j) {
                var ori_resid = this.ssbondpnts[id][j];
                var pos = ori_resid.indexOf('_');
                var resid = structure + ori_resid.substr(pos);

                this.ssbondpnts[structure].push(resid);
            }
        }
    }

    this.adjustSeq(chainMissingResidueArray);

//    this.missingResidues = [];
//    for(var chainid in chainMissingResidueArray) {
//        var resArray = chainMissingResidueArray[chainid];
//        for(var i = 0; i < resArray.length; ++i) {
//            this.missingResidues.push(chainid + '_' + resArray[i].resi);
//        }
//    }

    // remove the reference
    lines = null;

    // add the last residue set
    this.residues[residueNum] = residuesTmp;
    this.chains[chainNum] = this.unionHash2Atoms(this.chains[chainNum], chainsTmp);

    var curChain, curResi, curInsc, curResAtoms = [], me = this;
    // refresh for atoms in each residue
    var refreshBonds = function (f) {
        var n = curResAtoms.length;
        for (var j = 0; j < n; ++j) {
            var atom0 = curResAtoms[j];
            for (var k = j + 1; k < n; ++k) {
                var atom1 = curResAtoms[k];
                if (atom0.alt === atom1.alt && me.hasCovalentBond(atom0, atom1)) {
                //if (me.hasCovalentBond(atom0, atom1)) {
                    atom0.bonds.push(atom1.serial);
                    atom1.bonds.push(atom0.serial);
                }
            }
            f && f(atom0);
        }
    };
    var pmin = new THREE.Vector3( 9999, 9999, 9999);
    var pmax = new THREE.Vector3(-9999,-9999,-9999);
    var psum = new THREE.Vector3();
    var cnt = 0;

    // lipids may be considered as protein if "ATOM" instead of "HETATM" was used
    var lipidResidHash = {};

    // assign atoms
    for (var i in this.atoms) {
        var atom = this.atoms[i];
        var coord = atom.coord;
        psum.add(coord);
        pmin.min(coord);
        pmax.max(coord);
        ++cnt;

        if(!atom.het) {
          if($.inArray(atom.resn, this.nucleotidesArray) !== -1) {
            this.nucleotides[atom.serial] = 1;
            //if (atom.name === 'P') {
            if (atom.name === "O3'" || atom.name === "O3*") {
                this.nucleotidesO3[atom.serial] = 1;

                this.secondaries[atom.structure + '_' + atom.chain + '_' + atom.resi] = 'o'; // nucleotide
            }
          }
          else {
            if (atom.elem === 'P') {
                lipidResidHash[atom.structure + '_' + atom.chain + '_' + atom.resi] = 1;
            }

            this.proteins[atom.serial] = 1;
            if (atom.name === 'CA') this.calphas[atom.serial] = 1;
            if (atom.name !== 'N' && atom.name !== 'CA' && atom.name !== 'C' && atom.name !== 'O') this.sidec[atom.serial] = 1;
          }
        }
        else if(atom.het) {
          if(atom.resn === 'HOH' || atom.resn === 'WAT' || atom.resn === 'SOL') {
            this.water[atom.serial] = 1;
          }
          else if($.inArray(atom.resn, this.ionsArray) !== -1 || atom.elem.trim() === atom.resn.trim()) {
            this.ions[atom.serial] = 1;
          }
          else {
            this.chemicals[atom.serial] = 1;
          }
        }

        if (!(curChain === atom.chain && curResi === atom.resi)) {
            // a new residue, add the residue-residue bond beides the regular bonds
            refreshBonds(function (atom0) {
                if (((atom0.name === 'C' && atom.name === 'N') || (atom0.name === 'O3\'' && atom.name === 'P')) && me.hasCovalentBond(atom0, atom)) {
                    atom0.bonds.push(atom.serial);
                    atom.bonds.push(atom0.serial);
                }
            });
            curChain = atom.chain;
            curResi = atom.resi;
            //curInsc = atom.insc;
            curResAtoms.length = 0;
        }
        curResAtoms.push(atom);
    } // end of for

    // reset lipid
    for(resid in lipidResidHash) {
        var atomHash = this.residues[resid];
        for(serial in atomHash) {
            var atom = this.atoms[serial];

            atom.het = true;
            this.chemicals[atom.serial] = 1;
            this.secondaries[resid] = 'o'; // nucleotide

            delete this.proteins[atom.serial];
            if (atom.name === 'CA') delete this.calphas[atom.serial];
            if (atom.name !== 'N' && atom.name !== 'CA' && atom.name !== 'C' && atom.name !== 'O') delete this.sidec[atom.serial];
        }
    }

    // last residue
    refreshBonds();

    this.pmin = pmin;
    this.pmax = pmax;

    this.cnt = cnt;

    this.maxD = this.pmax.distanceTo(this.pmin);
    this.center = psum.multiplyScalar(1.0 / this.cnt);

    if (this.maxD < 5) this.maxD = 5;

    this.oriMaxD = this.maxD;
    this.oriCenter = this.center.clone();
};

iCn3D.prototype.adjustSeq = function (chainMissingResidueArray) {
    // adjust sequences
    for(var chainNum in this.chainsSeq) {
        if(chainMissingResidueArray[chainNum] === undefined) continue;

        var A = this.chainsSeq[chainNum];
        //var A2 = this.chainsAn[chainNum][0];
        //var A3 = this.chainsAn[chainNum][1];
        var B = chainMissingResidueArray[chainNum];

        var m = A.length;
        var n = B.length;

        var C = new Array(m + n);
        //var C2 = new Array(m + n);
        //var C3 = new Array(m + n);

        // http://www.algolist.net/Algorithms/Merge/Sorted_arrays
        // m - size of A
        // n - size of B
        // size of C array must be equal or greater than m + n
          var i, j, k;
          i = 0;
          j = 0;
          k = 0;
          while (i < m && j < n) {
                if (A[i].resi <= B[j].resi) {
                      C[k] = A[i];
                      //C2[k] = A2[i];
                      //C3[k] = A3[i];
                      i++;
                } else {
                      C[k] = B[j];
                      //if(B[j].resi % 10 === 0) {
                      //    C2[k] = B[j].resi.toString();
                      //}
                      //else {
                      //    C2[k] = '';
                      //}
                      //C3[k] = '-';
                      j++;
                }
                k++;
          }
          if (i < m) {
                for (var p = i; p < m; p++) {
                      C[k] = A[p];
                      //C2[k] = A2[p];
                      //C3[k] = A3[p];
                      k++;
                }
          } else {
                for (var p = j; p < n; p++) {
                      C[k] = B[p];
                      //if(B[p].resi % 10 === 0) {
                      //    C2[k] = B[p].resi.toString();
                      //}
                      //else {
                      //    C2[k] = '';
                      //}
                      //C3[k] = '-';
                      k++;
                }
          }

        this.chainsSeq[chainNum] = C;
        //this.chainsAn[chainNum][0] = C2;
        //this.chainsAn[chainNum][1] = C3;
    }
};
/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createSphere = function (atom, defaultRadius, forceDefault, scale, bHighlight) {
    var mesh;

    if(defaultRadius === undefined) defaultRadius = 0.8;
    if(forceDefault === undefined) forceDefault = false;
    if(scale === undefined) scale = 1.0;

    var radius = (this.vdwRadii[atom.elem] || defaultRadius);

    if(bHighlight === 2) {
      //if(scale > 0.9) { // sphere
      //  scale = 1.5;
      //}
      //else if(scale < 0.5) { // dot
      //  scale = 1.0;
      //}

      scale *= 1.5;

      var color = this.hColor;

      mesh = new THREE.Mesh(this.sphereGeometry, new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.5, specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));

      mesh.scale.x = mesh.scale.y = mesh.scale.z = forceDefault ? defaultRadius :  radius * (scale ? scale : 1);
      mesh.position.copy(atom.coord);
      this.mdl.add(mesh);
    }
    else if(bHighlight === 1) {
      mesh = new THREE.Mesh(this.sphereGeometry, this.matShader);

      mesh.scale.x = mesh.scale.y = mesh.scale.z = forceDefault ? defaultRadius :  radius * (scale ? scale : 1);
      mesh.position.copy(atom.coord);
      mesh.renderOrder = this.renderOrderPicking;
      //this.mdlPicking.add(mesh);
      this.mdl.add(mesh);
    }
    else {
      if(atom.color === undefined) {
          atom.color = this.defaultAtomColor;
      }

      var color = atom.color;

      mesh = new THREE.Mesh(this.sphereGeometry, new THREE.MeshPhongMaterial({ specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));
      mesh.scale.x = mesh.scale.y = mesh.scale.z = forceDefault ? defaultRadius :  radius * (scale ? scale : 1);
      mesh.position.copy(atom.coord);

      if(this.bImpo) {
          this.posArraySphere.push(atom.coord.x);
          this.posArraySphere.push(atom.coord.y);
          this.posArraySphere.push(atom.coord.z);

          this.colorArraySphere.push(atom.color.r);
          this.colorArraySphere.push(atom.color.g);
          this.colorArraySphere.push(atom.color.b);

          var realRadius = forceDefault ? defaultRadius :  radius * (scale ? scale : 1);
          this.radiusArraySphere.push(realRadius);

          if(this.cnt <= this.maxatomcnt) this.mdl_ghost.add(mesh);
      }
      else {
          this.mdl.add(mesh);
      }
    }

    //this.mdl.add(mesh);

    if(bHighlight === 1 || bHighlight === 2) {
        if(this.bImpo) {
            if(this.cnt <= this.maxatomcnt) this.prevHighlightObjects_ghost.push(mesh);
        }
        else {
            this.prevHighlightObjects.push(mesh);
        }
    }
    else {
        if(this.bImpo) {
            if(this.cnt <= this.maxatomcnt) this.objects_ghost.push(mesh);
        }
        else {
            this.objects.push(mesh);
        }
    }
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createCylinder = function (p0, p1, radius, color, bHighlight, color2, bPicking) {
    var mesh;
    if(bHighlight === 1) {
        mesh = new THREE.Mesh(this.cylinderGeometryOutline, this.matShader);

        mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
        mesh.matrixAutoUpdate = false;
        mesh.lookAt(p1.clone().sub(p0));
        mesh.updateMatrix();

        mesh.matrix.multiply(new THREE.Matrix4().makeScale(radius, radius, p0.distanceTo(p1))).multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));

        mesh.renderOrder = this.renderOrderPicking;
        //this.mdlPicking.add(mesh);
        this.mdl.add(mesh);

        this.prevHighlightObjects.push(mesh);
    }
    else {
        if(bHighlight === 2) {
          mesh = new THREE.Mesh(this.cylinderGeometry, new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.5, specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));

          radius *= 1.5;
        }
        else {
          mesh = new THREE.Mesh(this.cylinderGeometry, new THREE.MeshPhongMaterial({ specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));
        }

        mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
        mesh.matrixAutoUpdate = false;
        //mesh.lookAt(p0);
        mesh.lookAt(p1.clone().sub(p0));
        mesh.updateMatrix();

        mesh.matrix.multiply(new THREE.Matrix4().makeScale(radius, radius, p0.distanceTo(p1))).multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));

        if(this.bImpo) {
          this.posArray.push(p0.x);
          this.posArray.push(p0.y);
          this.posArray.push(p0.z);

          this.colorArray.push(color.r);
          this.colorArray.push(color.g);
          this.colorArray.push(color.b);

          this.pos2Array.push(p1.x);
          this.pos2Array.push(p1.y);
          this.pos2Array.push(p1.z);

          if(color2 !== undefined) {
              this.color2Array.push(color2.r);
              this.color2Array.push(color2.g);
              this.color2Array.push(color2.b);
          }
          else {
              this.color2Array.push(color.r);
              this.color2Array.push(color.g);
              this.color2Array.push(color.b);
          }

          this.radiusArray.push(radius);

          if(this.cnt <= this.maxatomcnt) this.mdl_ghost.add(mesh);
        }
        else {
            this.mdl.add(mesh);
        }

        if(bHighlight === 2) {
            if(this.bImpo) {
                if(this.cnt <= this.maxatomcnt) this.prevHighlightObjects_ghost.push(mesh);
            }
            else {
                this.prevHighlightObjects.push(mesh);
            }
        }
        else {
            if(this.bImpo) {
                if(this.cnt <= this.maxatomcnt) this.objects_ghost.push(mesh);
            }
            else {
                if(bPicking === undefined || bPicking) this.objects.push(mesh);
            }
        }
    }
};

// from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createRepresentationSub = function (atoms, f0, f01) {
    var me = this;

    //var ged = new THREE.Geometry();
    var clbondArray = [];
    for (var i in atoms) {
        var atom0 = atoms[i];
        f0 && f0(atom0);

        for (var j in atom0.bonds) {
            var atom1 = this.atoms[atom0.bonds[j]];
            if (atom1 === undefined || atom1.serial < atom0.serial) continue;
            if (atom1.chain === atom0.chain && ((atom1.resi === atom0.resi) || (atom0.name === 'C' && atom1.name === 'N') || (atom0.name === 'O3\'' && atom1.name === 'P') || (atom0.name === 'O3*' && atom1.name === 'P') || (atom0.name === 'SG' && atom1.name === 'SG'))) {
                f01 && f01(atom0, atom1);
            } else {
                //ged.vertices.push(atom0.coord);
                //ged.vertices.push(atom1.coord);
                clbondArray.push([atom0.coord, atom1.coord]);
            }
        }
    }
    //if (ged.vertices.length && this.bShowCrossResidueBond) {
    if (clbondArray.length > 0 && this.bShowCrossResidueBond) {
        //ged.computeLineDistances();
        //this.mdl.add(new THREE.Line(ged, new THREE.LineDashedMaterial({ linewidth: this.linewidth, color: this.defaultBondColor, dashSize: 0.3, gapSize: 0.15 }), THREE.LineSegments));
        var color = new THREE.Color(0x00FF00);

        for(var i = 0, il = clbondArray.length; i < il; ++i) {
            me.createCylinder(clbondArray[i][0], clbondArray[i][1], this.cylinderRadius, color, 0);
        }
    }
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createSphereRepresentation = function (atoms, defaultRadius, forceDefault, scale, bHighlight) {
    var me = this;

    this.createRepresentationSub(atoms, function (atom0) {
        me.createSphere(atom0, defaultRadius, forceDefault, scale, bHighlight);
    });
};

iCn3D.prototype.createBoxRepresentation_P_CA = function (atoms, scale, bHighlight) {
    var me = this;
    this.createRepresentationSub(atoms, function (atom0) {
        if(atom0.name === 'CA' || atom0.name === "O3'" || atom0.name === "O3*") {
            me.createBox(atom0, undefined, undefined, scale, undefined, bHighlight);
        }
    });
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createStickRepresentation = function (atoms, atomR, bondR, scale, bHighlight, bSchematic) {
    var me = this;
    var factor = (bSchematic !== undefined && bSchematic) ? atomR / me.cylinderRadius : 1;

//        if(bHighlight !== 2) {
        this.createRepresentationSub(atoms, function (atom0) {
                me.createSphere(atom0, atomR, !scale, scale, bHighlight);
        }, function (atom0, atom1) {
            var mp = atom0.coord.clone().add(atom1.coord).multiplyScalar(0.5);
            var pair = atom0.serial + '_' + atom1.serial;

            if(me.doublebonds.hasOwnProperty(pair)) { // show double bond
                var a0, a1, a2;

                var v0;
                var random = new THREE.Vector3(Math.random(),Math.random(),Math.random());
                if(atom0.bonds.length == 1 && atom1.bonds.length == 1) {
                    v0 = atom1.coord.clone();
                    v0.sub(atom0.coord);

                    var v = random.clone();
                    v0.cross(v).normalize().multiplyScalar(0.2 * factor);
                }
                else {
                    if(atom0.bonds.length >= atom1.bonds.length && atom0.bonds.length > 1) {
                        a0 = atom0.serial;
                        a1 = atom0.bonds[0];
                        a2 = atom0.bonds[1];
                    }
                    //else {
                    else if(atom1.bonds.length >= atom0.bonds.length && atom1.bonds.length > 1) {
                        a0 = atom1.serial;
                        a1 = atom1.bonds[0];
                        a2 = atom1.bonds[1];
                    }
                    else {
                        console.log("Double bond was not drawn due to the undefined cross plane");
                        return;
                    }

                    var v1 = me.atoms[a0].coord.clone();
                    v1.sub(me.atoms[a1].coord);
                    var v2 = me.atoms[a0].coord.clone();
                    v2.sub(me.atoms[a2].coord);

                    v1.cross(v2);

                    // parallel
                    if(parseInt(v1.length() * 10000) == 0) {
                        //v1 = random.clone();
                        // use a constant so that they are fixed,e.g., in CO2
                        v1 = new THREE.Vector3(0.2, 0.3, 0.5);
                    }

                    v0 = atom1.coord.clone();
                    v0.sub(atom0.coord);

                    v0.cross(v1).normalize().multiplyScalar(0.2 * factor);
                    // parallel
                    if(parseInt(v0.length() * 10000) == 0) {
                        //v1 = random.clone();
                        // use a constant so that they are fixed,e.g., in CO2
                        v1 = new THREE.Vector3(0.5, 0.3, 0.2);
                        v0.cross(v1).normalize().multiplyScalar(0.2 * factor);
                    }
                }

                if (atom0.color === atom1.color) {
                    me.createCylinder(atom0.coord.clone().add(v0), atom1.coord.clone().add(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                    me.createCylinder(atom0.coord.clone().sub(v0), atom1.coord.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                } else {
                    if(me.bImpo) {
                        me.createCylinder(atom0.coord.clone().add(v0), atom1.coord.clone().add(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight, atom1.color);
                        me.createCylinder(atom0.coord.clone().sub(v0), atom1.coord.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight, atom1.color);
                    }
                    else {
                        me.createCylinder(atom0.coord.clone().add(v0), mp.clone().add(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().add(v0), mp.clone().add(v0), me.cylinderRadius * factor * 0.3, atom1.color, bHighlight);

                        me.createCylinder(atom0.coord.clone().sub(v0), mp.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().sub(v0), mp.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom1.color, bHighlight);
                    }
                }
            }
            else if(me.aromaticbonds.hasOwnProperty(pair)) { // show aromatic bond
                var a0, a1, a2;
                if(atom0.bonds.length > atom1.bonds.length && atom0.bonds.length > 1) {
                    a0 = atom0.serial;
                    a1 = atom0.bonds[0];
                    a2 = atom0.bonds[1];
                }
                else if(atom1.bonds.length > 1) {
                    a0 = atom1.serial;
                    a1 = atom1.bonds[0];
                    a2 = atom1.bonds[1];
                }
                else {
                    return;
                }

                var v1 = me.atoms[a0].coord.clone();
                v1.sub(me.atoms[a1].coord);
                var v2 = me.atoms[a0].coord.clone();
                v2.sub(me.atoms[a2].coord);

                v1.cross(v2);

                var v0 = atom1.coord.clone();
                v0.sub(atom0.coord);

                v0.cross(v1).normalize().multiplyScalar(0.2 * factor);

                // find an aromatic neighbor
                var aromaticNeighbor = 0;
                for(var i = 0, il = atom0.bondOrder.length; i < il; ++i) {
                    if(atom0.bondOrder[i] === '1.5' && atom0.bonds[i] !== atom1.serial) {
                        aromaticNeighbor = atom0.bonds[i];
                    }
                }

                var dashed = "add";
                if(aromaticNeighbor === 0 ) { // no neighbor found, atom order does not matter
                    dashed = "add";
                }
                else {
                    // calculate the angle between atom1, atom0add, atomNeighbor and the angle atom1, atom0sub, atomNeighbor
                    var atom0add = atom0.coord.clone().add(v0);
                    var atom0sub = atom0.coord.clone().sub(v0);

                    var a = atom1.coord.clone().sub(atom0add).normalize();
                    var b = me.atoms[aromaticNeighbor].coord.clone().sub(atom0add).normalize();

                    var c = atom1.coord.clone().sub(atom0sub).normalize();
                    var d = me.atoms[aromaticNeighbor].coord.clone().sub(atom0sub).normalize();

                    var angleadd = Math.acos(a.dot(b));
                    var anglesub = Math.acos(c.dot(d));

                    if(angleadd < anglesub) {
                        dashed = 'sub';
                    }
                    else {
                        dashed = 'add';
                    }
                }

                if (atom0.color === atom1.color) {
                    var base, step;
                    if(dashed === 'add') {
                        me.createCylinder(atom0.coord.clone().sub(v0), atom1.coord.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);

                        base = atom0.coord.clone().add(v0);
                        step = atom1.coord.clone().add(v0).sub(base).multiplyScalar(1.0/11);
                    }
                    else {
                        me.createCylinder(atom0.coord.clone().add(v0), atom1.coord.clone().add(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);

                        base = atom0.coord.clone().sub(v0);
                        step = atom1.coord.clone().sub(v0).sub(base).multiplyScalar(1.0/11);
                    }

                    for(var i = 0; i <= 10; ++i) {
                        if(i % 2 == 0) {
                            var pos1 = base.clone().add(step.clone().multiplyScalar(i));
                            var pos2 = base.clone().add(step.clone().multiplyScalar(i + 1));
                            me.createCylinder(pos1, pos2, me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                        }
                    }

                } else {
                    var base, step;
                    if(dashed === 'add') {
                        me.createCylinder(atom0.coord.clone().sub(v0), mp.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().sub(v0), mp.clone().sub(v0), me.cylinderRadius * factor * 0.3, atom1.color, bHighlight);

                        base = atom0.coord.clone().add(v0);
                        step = atom1.coord.clone().add(v0).sub(base).multiplyScalar(1.0/11);
                    }
                    else {
                        me.createCylinder(atom0.coord.clone().add(v0), mp.clone().add(v0), me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().add(v0), mp.clone().add(v0), me.cylinderRadius * factor * 0.3, atom1.color, bHighlight);

                        base = atom0.coord.clone().sub(v0);
                        step = atom1.coord.clone().sub(v0).sub(base).multiplyScalar(1.0/11);
                    }

                    for(var i = 0; i <= 10; ++i) {
                        if(i % 2 == 0) {
                            var pos1 = base.clone().add(step.clone().multiplyScalar(i));
                            var pos2 = base.clone().add(step.clone().multiplyScalar(i + 1));
                            if(i < 5) {
                                me.createCylinder(pos1, pos2, me.cylinderRadius * factor * 0.3, atom0.color, bHighlight);
                            }
                            else {
                                me.createCylinder(pos1, pos2, me.cylinderRadius * factor * 0.3, atom1.color, bHighlight);
                            }
                        }
                    }
                }
            }
            else if(me.triplebonds.hasOwnProperty(pair)) { // show triple bond
                var random = new THREE.Vector3(Math.random(),Math.random(),Math.random());
                var v = atom1.coord.clone();
                v.sub(atom0.coord);

                var c = random.clone();
                c.cross(v).normalize().multiplyScalar(0.3 * factor);

                if (atom0.color === atom1.color) {
                    me.createCylinder(atom0.coord, atom1.coord, me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                    me.createCylinder(atom0.coord.clone().add(c), atom1.coord.clone().add(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                    me.createCylinder(atom0.coord.clone().sub(c), atom1.coord.clone().sub(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                } else {
                    if(me.bImpo) {
                        me.createCylinder(atom0.coord, atom1.coord, me.cylinderRadius * factor * 0.2, atom0.color, bHighlight, atom1.color);
                        me.createCylinder(atom0.coord.clone().add(c), atom1.coord.clone().add(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight, atom1.color);
                        me.createCylinder(atom0.coord.clone().sub(c), atom1.coord.clone().sub(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight, atom1.color);
                    }
                    else {
                        me.createCylinder(atom0.coord, mp, me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord, mp, me.cylinderRadius * factor * 0.2, atom1.color, bHighlight);

                        me.createCylinder(atom0.coord.clone().add(c), mp.clone().add(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().add(c), mp.clone().add(c), me.cylinderRadius * factor * 0.2, atom1.color, bHighlight);

                        me.createCylinder(atom0.coord.clone().sub(c), mp.clone().sub(c), me.cylinderRadius * factor * 0.2, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord.clone().sub(c), mp.clone().sub(c), me.cylinderRadius * factor * 0.2, atom1.color, bHighlight);
                    }
                }
            }
            else {
                if (atom0.color === atom1.color) {
                    me.createCylinder(atom0.coord, atom1.coord, bondR, atom0.color, bHighlight);
                } else {
                    if(me.bImpo) {
                        me.createCylinder(atom0.coord, atom1.coord, bondR, atom0.color, bHighlight, atom1.color);
                    }
                    else {
                        me.createCylinder(atom0.coord, mp, bondR, atom0.color, bHighlight);
                        me.createCylinder(atom1.coord, mp, bondR, atom1.color, bHighlight);
                    }
                }
            }
        });
//        }
//        else if(bHighlight === 2) {
//            this.createBoxRepresentation_P_CA(atoms, 1.2, bHighlight);
//        }
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createLineRepresentation = function (atoms, bHighlight) {
    var me = this;
    var geo = new THREE.Geometry();
    this.createRepresentationSub(atoms, undefined, function (atom0, atom1) {
        if (atom0.color === atom1.color) {
            geo.vertices.push(atom0.coord);
            geo.vertices.push(atom1.coord);
            geo.colors.push(atom0.color);
            geo.colors.push(atom1.color);
        } else {
            var mp = atom0.coord.clone().add(atom1.coord).multiplyScalar(0.5);
            geo.vertices.push(atom0.coord);
            geo.vertices.push(mp);
            geo.vertices.push(atom1.coord);
            geo.vertices.push(mp);
            geo.colors.push(atom0.color);
            geo.colors.push(atom0.color);
            geo.colors.push(atom1.color);
            geo.colors.push(atom1.color);
        }
    });

    if(bHighlight !== 2) {
        var line;
        if(bHighlight === 1) {
            // highlight didn't work for lines
            //line = new THREE.Mesh(geo, this.matShader);
        }
        else {
            //line = new THREE.Line(geo, new THREE.LineBasicMaterial({ linewidth: this.linewidth, vertexColors: true }), THREE.LineSegments);
            line = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ linewidth: this.linewidth, vertexColors: true }));
            this.mdl.add(line);
        }

        if(bHighlight === 1) {
            this.prevHighlightObjects.push(line);
        }
        else {
            this.objects.push(line);
        }
    }
    else if(bHighlight === 2) {
        this.createBoxRepresentation_P_CA(atoms, 0.8, bHighlight);
    }
};

/*
// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
// Catmull–Rom subdivision
iCn3D.prototype.subdivide = function (_pnts, _clrs, DIV, bShowArray, bHighlight, prevone, nexttwo, bExtendLastRes) {
    var ret = [];
    var pos = [];
    var color = [];

    var pnts = new Array(); // Smoothing test

    var prevoneLen = (prevone !== undefined) ? prevone.length : 0;
    var nexttwoLenOri = (nexttwo !== undefined) ? nexttwo.length : 0;

    if(prevoneLen > 0) pnts.push(prevone[0]);

    pnts.push(_pnts[0]);
    for (var i = 1, lim = _pnts.length - 1; i < lim; ++i) {
        var p0 = _pnts[i], p1 = _pnts[i + 1];
        pnts.push(p0.smoothen ? p0.clone().add(p1).multiplyScalar(0.5) : p0);
    }
    pnts.push(_pnts[_pnts.length - 1]);

    if(nexttwoLenOri > 0) pnts.push(nexttwo[0]);
    if(nexttwoLenOri > 1) pnts.push(nexttwo[1]);

    var savedPoints = [];
    var savedPos = [];
    var savedColor = [];

    var nexttwoLen = nexttwoLenOri;
    if(bExtendLastRes) {
        nexttwoLen = (nexttwoLenOri > 0) ? nexttwoLenOri - 1 : 0;
    }

    for (var i = -1, size = pnts.length, DIVINV = 1 / DIV; i <= size - 3; ++i) {
        var newI = i - prevoneLen;
        var p0 = pnts[i === -1 ? 0 : i];
        var p1 = pnts[i + 1];
        var p2 = pnts[i + 2];
        var p3 = pnts[i === size - 3 ? size - 1 : i + 3];
        var v0 = p2.clone().sub(p0).multiplyScalar(0.5);
        var v1 = p3.clone().sub(p1).multiplyScalar(0.5);

        //if(i > -1 && bHighlight && bShowArray !== undefined && bShowArray[i + 1]) {
        if(i > -1 && (bShowArray === undefined || bShowArray[newI + 1]) ) {
            // get from previous i for the first half of residue
            if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen + 1) {
                ret = ret.concat(savedPoints);
                pos = pos.concat(savedPos);
                color = color.concat(savedColor);
            }
        }

        savedPoints = [];
        savedPos = [];
        savedColor = [];

        for (var j = 0; j < DIV; ++j) {
            var t = DIVINV * j;
            var x = p1.x + t * v0.x
                     + t * t * (-3 * p1.x + 3 * p2.x - 2 * v0.x - v1.x)
                     + t * t * t * (2 * p1.x - 2 * p2.x + v0.x + v1.x);
            var y = p1.y + t * v0.y
                     + t * t * (-3 * p1.y + 3 * p2.y - 2 * v0.y - v1.y)
                     + t * t * t * (2 * p1.y - 2 * p2.y + v0.y + v1.y);
            var z = p1.z + t * v0.z
                     + t * t * (-3 * p1.z + 3 * p2.z - 2 * v0.z - v1.z)
                     + t * t * t * (2 * p1.z - 2 * p2.z + v0.z + v1.z);

            if(!bShowArray) {
                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen) {
                    ret.push(new THREE.Vector3(x, y, z));
                    pos.push(newI + 1);
                    color.push(_clrs[newI+1]);
                }
            }
            else {
                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen) {
                    if(bShowArray[newI + 1]) {
                        if(j <= parseInt((DIV) / 2) ) {
                            ret.push(new THREE.Vector3(x, y, z));
                            pos.push(bShowArray[newI + 1]);
                            color.push(_clrs[newI+1]);
                        }
                    }
                }

                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen + 1) {
                    if(bShowArray[newI + 2]) {
                        if(j > parseInt((DIV) / 2) ) {
                            savedPoints.push(new THREE.Vector3(x, y, z));
                            savedPos.push(bShowArray[newI + 2]);
                            savedColor.push(_clrs[newI+2]);
                        }
                    }
                }
            } // end else

        } // end for (var j = 0;
    } // end for (var i = -1;

    if(!bShowArray || bShowArray[newI + 1]) {
        //if(bHighlight) {
        ret = ret.concat(savedPoints);
        pos = pos.concat(savedPos);
        color = color.concat(savedColor);
        //}

        ret.push(pnts[pnts.length - 1 - nexttwoLen]);
        pos.push(pnts.length - 1 - nexttwoLen);
        color.push(_clrs[pnts.length - 1 - nexttwoLen]);
    }

    savedPoints = [];
    savedPos = [];
    savedColor = [];
    pnts = [];

    var pnts_positions = [];

    pnts_positions.push(ret);
    pnts_positions.push(pos);
    pnts_positions.push(color);

    return pnts_positions;
};
*/

iCn3D.prototype.getKnot = function (alpha, ti, Pi, Pj) {
    var alpha = 1;

    //return Math.pow(Pi.distanceTo(Pj), alpha) + ti;
    return Pi.distanceTo(Pj) + ti;
}

iCn3D.prototype.getValueFromKnot = function (t, t0, t1, t2, t3, y0, y1, y2, y3) {
    var inf = 9999;

    // m(i) = ( t(i+1) - t(i) == 0 ) ? 0 : ( y(i+1) - y(i) ) / ( t(i+1) - t(i) )
    var m0 = (y1 - y0) / (t1 - t0);
    var m1 = (y2 - y1) / (t2 - t1);
    var m2 = (y3 - y2) / (t3 - t2);

    // L(i) = m(i) * (t - t(i)) + y(i)
    //var L0 = m0 * (t - t0) + y0;
    var L1 = m1 * (t - t1) + y1;
    //var L2 = m2 * (t - t2) + y2;

    var denom = (t1 + t2) * (t1 + t2) - 4*(t0*t1 + t2*t3 - t0*t3);
    var d0 = 0;
    var d3 = 0;
    var d1, d2;

    if(denom == 0) {
        d1 = inf;
        d2 = inf;
    }
    else {
        d1 = 6 * (3*m1*t1 + 2*m0*t3 + m2*t1 - 2*m0*t1 - 2*m1*t3 - m1*t2 - m2*t1) / denom;
        d2 = 6 * (3*m1*t2 + 2*m2*t0 + m0*t1 - 2*m1*t0 - 2*m2*t2 - m0*t2 - m1*t1) / denom;
    }

    // a(i) = ( 2*d(i) + d(i+1) ) / 6 / (t(i) - t(i+1))
    // b(i) = ( 2*d(i+1) + d(i) ) / 6 / (t(i+1) - t(i))
    //var a0 = ( 2*d0 + d1 ) / 6 / (t0 - t1);
    var a1 = ( 2*d1 + d2 ) / 6 / (t1 - t2);
    //var a2 = ( 2*d2 + d3 ) / 6 / (t2 - t3);

    //var b0 = ( 2*d1 + d0 ) / 6 / (t1 - t0);
    var b1 = ( 2*d2 + d1 ) / 6 / (t2 - t1);
    //var b2 = ( 2*d3 + d2 ) / 6 / (t3 - t2);

    // C(i) = a(i)*(t - t(i))*(t - t(i+1))*(t - t(i+1)) + b(i)*(t - t(i))*(t - t(i))*(t - t(i+1))
    //var C0 = a0*(t - t0)*(t - t1)*(t - t1) + b0*(t - t0)*(t - t0)*(t - t1);
    var C1 = a1*(t - t1)*(t - t2)*(t - t2) + b1*(t - t1)*(t - t1)*(t - t2);
    //var C2 = a2*(t - t2)*(t - t3)*(t - t3) + b2*(t - t2)*(t - t2)*(t - t3);

    var F1 = L1 + C1;

    return F1;
}

// cubic splines for four points: http://thalestriangles.blogspot.com/2014/02/a-bit-of-ex-spline-ation.html
// https://math.stackexchange.com/questions/577641/how-to-calculate-interpolating-splines-in-3d-space
iCn3D.prototype.subdivide = function (_pnts, _clrs, DIV, bShowArray, bHighlight, prevone, nexttwo, bExtendLastRes) {
    var ret = [];
    var pos = [];
    var color = [];

    var pnts = new Array(); // Smoothing test

    var prevoneLen = (prevone !== undefined) ? prevone.length : 0;
    var nexttwoLenOri = (nexttwo !== undefined) ? nexttwo.length : 0;

    if(prevoneLen > 0) pnts.push(prevone[0]);

    pnts.push(_pnts[0]);
    for (var i = 1, lim = _pnts.length - 1; i < lim; ++i) {
        var p0 = _pnts[i], p1 = _pnts[i + 1];
        pnts.push(p0.smoothen ? p0.clone().add(p1).multiplyScalar(0.5) : p0);
    }
    pnts.push(_pnts[_pnts.length - 1]);

    if(nexttwoLenOri > 0) pnts.push(nexttwo[0]);
    if(nexttwoLenOri > 1) pnts.push(nexttwo[1]);

    var savedPoints = [];
    var savedPos = [];
    var savedColor = [];

    var nexttwoLen = nexttwoLenOri;
    if(bExtendLastRes) {
        nexttwoLen = (nexttwoLenOri > 0) ? nexttwoLenOri - 1 : 0;
    }

    var alpha = 1;

    for (var i = -1, size = pnts.length, DIVINV = 1 / DIV; i <= size - 3; ++i) {
        var newI = i - prevoneLen;
        var p0 = pnts[i === -1 ? 0 : i];
        var p1 = pnts[i + 1];
        var p2 = pnts[i + 2];
        var p3 = pnts[i === size - 3 ? size - 1 : i + 3];

        var t0 = 0;
        var t1 = this.getKnot(alpha, t0, p0, p1);
        var t2 = this.getKnot(alpha, t1, p1, p2);
        var t3 = this.getKnot(alpha, t2, p2, p3);

        if(t1 - t0 < 1e-4) t1 = t0 + 1;
        if(t2 - t1 < 1e-4) t2 = t1 + 1;
        if(t3 - t2 < 1e-4) t3 = t2 + 1;

        //if(i > -1 && bHighlight && bShowArray !== undefined && bShowArray[i + 1]) {
        if(i > -1 && (bShowArray === undefined || bShowArray[newI + 1]) ) {
            // get from previous i for the first half of residue
            if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen + 1) {
                ret = ret.concat(savedPoints);
                pos = pos.concat(savedPos);
                color = color.concat(savedColor);
            }
        }

        savedPoints = [];
        savedPos = [];
        savedColor = [];

        var step = (t2 - t1) * DIVINV;
        for (var j = 0; j < DIV; ++j) {
            var t = t1 + step * j;
            var x = this.getValueFromKnot(t, t0, t1, t2, t3, p0.x, p1.x, p2.x, p3.x);
            var y = this.getValueFromKnot(t, t0, t1, t2, t3, p0.y, p1.y, p2.y, p3.y);
            var z = this.getValueFromKnot(t, t0, t1, t2, t3, p0.z, p1.z, p2.z, p3.z);

            if(!bShowArray) {
                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen) {
                    ret.push(new THREE.Vector3(x, y, z));
                    pos.push(newI + 1);
                    color.push(_clrs[newI+1]);
                }
            }
            else {
                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen) {
                    if(bShowArray[newI + 1]) {
                        if(j <= parseInt((DIV) / 2) ) {
                            ret.push(new THREE.Vector3(x, y, z));
                            pos.push(bShowArray[newI + 1]);
                            color.push(_clrs[newI+1]);
                        }
                    }
                }

                if(i >= -1 + prevoneLen && i <= size - 3 - nexttwoLen + 1) {
                    if(bShowArray[newI + 2]) {
                        if(j > parseInt((DIV) / 2) ) {
                            savedPoints.push(new THREE.Vector3(x, y, z));
                            savedPos.push(bShowArray[newI + 2]);
                            savedColor.push(_clrs[newI+2]);
                        }
                    }
                }
            } // end else

        } // end for (var j = 0;
    } // end for (var i = -1;

    if(!bShowArray || bShowArray[newI + 1]) {
        //if(bHighlight) {
        ret = ret.concat(savedPoints);
        pos = pos.concat(savedPos);
        color = color.concat(savedColor);
        //}

        ret.push(pnts[pnts.length - 1 - nexttwoLen]);
        pos.push(pnts.length - 1 - nexttwoLen);
        color.push(_clrs[pnts.length - 1 - nexttwoLen]);
    }

    savedPoints = [];
    savedPos = [];
    savedColor = [];
    pnts = [];

    var pnts_positions = [];

    pnts_positions.push(ret);
    pnts_positions.push(pos);
    pnts_positions.push(color);

    return pnts_positions;
};

iCn3D.prototype.createCurveSubArrow = function (p, width, colors, div, bHighlight, bRibbon, num, positionIndex, pntsCA, prevCOArray, bShowArray, calphaIdArray, bShowArrow, prevone, nexttwo) {
    var divPoints = [], positions = [];

    divPoints.push(p);
    positions.push(positionIndex);

    this.prepareStrand(divPoints, positions, width, colors, div, undefined, bHighlight, bRibbon, num, pntsCA, prevCOArray, false, bShowArray, calphaIdArray, bShowArrow, prevone, nexttwo);

    divPoints = [];
    positions = [];
};

iCn3D.prototype.setCalphaDrawnCoord = function (pnts, div, calphaIdArray) {
    var index = 0;

    if(calphaIdArray !== undefined) {
        for(var i = 0, il = pnts.length; i < il; i += div) { // pnts.length = (calphaIdArray.length - 1) * div + 1
            var serial = calphaIdArray[index];

            if(this.atoms.hasOwnProperty(serial)) {
                this.atoms[serial].coord2 = pnts[i].clone();
            }

            ++index;
        }
    }
};


// modified from iview (http://star.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createCurveSub = function (_pnts, width, colors, div, bHighlight, bRibbon, bNoSmoothen, bShowArray, calphaIdArray, positions, prevone, nexttwo) {
    if (_pnts.length === 0) return;
    div = div || 5;
    var pnts;
    if(!bNoSmoothen) {
        var bExtendLastRes = true;
        var pnts_clrs = this.subdivide(_pnts, colors, div, bShowArray, bHighlight, prevone, nexttwo, bExtendLastRes);
        pnts = pnts_clrs[0];
        colors = pnts_clrs[2];
    }
    else {
        pnts = _pnts;
    }
    if (pnts.length === 0) return;

    this.setCalphaDrawnCoord(pnts, div, calphaIdArray);

    if(bHighlight === 1) {
        var radius = this.coilWidth / 2;
        //var radiusSegments = 8;
        var radiusSegments = 4; // save memory
        var closed = false;

        if(pnts.length > 1) {
            if(positions !== undefined) {
                var currPos, prevPos;
                var currPoints = [];
                for(var i = 0, il = pnts.length; i < il; ++i) {
                    currPos = positions[i];

                    if( (currPos !== prevPos && currPos !== prevPos + 1 && prevPos !== undefined) || (i === il -1) ) {
                        // first tube
                        var geometry0 = new THREE.TubeGeometry(
                            new THREE.CatmullRomCurve3(currPoints), // path
                            currPoints.length, // segments
                            radius,
                            radiusSegments,
                            closed
                        );

                        mesh = new THREE.Mesh(geometry0, this.matShader);
                        mesh.renderOrder = this.renderOrderPicking;
                        //this.mdlPicking.add(mesh);
                        this.mdl.add(mesh);

                        this.prevHighlightObjects.push(mesh);

                        geometry0 = null;

                        currPoints = [];
                    }

                    currPoints.push(pnts[i]);

                    prevPos = currPos;
                }

                currPoints = [];
            }
            else {
                var geometry0 = new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3(pnts), // path
                    pnts.length, // segments
                    radius,
                    radiusSegments,
                    closed
                );

                mesh = new THREE.Mesh(geometry0, this.matShader);
                mesh.renderOrder = this.renderOrderPicking;
                //this.mdlPicking.add(mesh);
                this.mdl.add(mesh);

                this.prevHighlightObjects.push(mesh);

                geometry0 = null;
            }
        }
    }
    else {
        var geo = new THREE.Geometry();

        if(bHighlight === 2 && bRibbon) {
            for (var i = 0, divInv = 1 / div; i < pnts.length; ++i) {
                // shift the highlight a little bit to avoid the overlap with ribbon
                pnts[i].addScalar(0.6); // this.ribbonthickness is 0.4
                geo.vertices.push(pnts[i]);
                //geo.colors.push(new THREE.Color(colors[i === 0 ? 0 : Math.round((i - 1) * divInv)]));
                geo.colors.push(new THREE.Color(colors[i]));
            }
        }
        else {
            for (var i = 0, divInv = 1 / div; i < pnts.length; ++i) {
                geo.vertices.push(pnts[i]);
                //geo.colors.push(new THREE.Color(colors[i === 0 ? 0 : Math.round((i - 1) * divInv)]));
                geo.colors.push(new THREE.Color(colors[i]));
            }
        }

        //var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ linewidth: width, vertexColors: true }), THREE.LineStrip);
        var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ linewidth: width, vertexColors: true }));
        this.mdl.add(line);
        if(bHighlight === 2) {
            this.prevHighlightObjects.push(line);
        }
        else {
            this.objects.push(line);
        }
    }

    pnts = null;
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createCylinderCurve = function (atoms, atomNameArray, radius, bLines, bHighlight) {
    var start = null;
    var currentChain, currentResi;
    var i;
    var pnts = [], colors = [], radii = [];

    var maxDistance = 8.0; // max residue-residue (or nucleitide-nucleitide) distance allowed

    for (i in atoms) {
        var atom = atoms[i];
        if (atom.het) continue;

        //if (atom.name !== atomName) continue;
        if(atomNameArray.indexOf(atom.name) == -1) continue;

        if (start !== null && currentChain === atom.chain && currentResi + 1 === atom.resi && Math.abs(start.coord.x - atom.coord.x) < maxDistance && Math.abs(start.coord.y - atom.coord.y) < maxDistance && Math.abs(start.coord.z - atom.coord.z) < maxDistance ) {
//            if (start !== null && currentChain === atom.chain && Math.abs(start.coord.x - atom.coord.x) < maxDistance && Math.abs(start.coord.y - atom.coord.y) < maxDistance && Math.abs(start.coord.z - atom.coord.z) < maxDistance ) {
            var middleCoord = start.coord.clone().add(atom.coord).multiplyScalar(0.5);

            if(!bHighlight) {
                if(bLines) {
                    var line = this.createSingleLine( start.coord, middleCoord, start.color, false);
                    this.mdl.add(line);
                    this.objects.push(line);
                    line = this.createSingleLine( middleCoord, atom.coord, atom.color, false);
                    this.mdl.add(line);
                    this.objects.push(line);
                }
                else {
                    this.createCylinder(start.coord, middleCoord, radius, start.color);
                    this.createCylinder(middleCoord, atom.coord, radius, atom.color);
                    this.createSphere(atom, radius, true, 1, bHighlight);
                }
            }
            else if(bHighlight === 1) {
                this.createCylinder(start.coord, middleCoord, radius, start.color, bHighlight);
                this.createCylinder(middleCoord, atom.coord, radius, atom.color, bHighlight);
                this.createSphere(atom, radius, true, 1, bHighlight);
            }
        }

        start = atom;
        currentChain = atom.chain;
        currentResi = atom.resi;

        if(bHighlight === 2) this.createBox(atom, undefined, undefined, undefined, undefined, bHighlight);
    }
    if (start !== null && currentChain === atom.chain && currentResi + 1 === atom.resi && Math.abs(start.coord.x - atom.coord.x) < maxDistance && Math.abs(start.coord.y - atom.coord.y) < maxDistance && Math.abs(start.coord.z - atom.coord.z) < maxDistance ) {
//        if (start !== null && currentChain === atom.chain && Math.abs(start.coord.x - atom.coord.x) < maxDistance && Math.abs(start.coord.y - atom.coord.y) < maxDistance && Math.abs(start.coord.z - atom.coord.z) < maxDistance ) {
        var middleCoord = start.coord.add(atom.coord).multiplyScalar(0.5);
        if(!bHighlight) {
            if(bLines) {
                var line = this.createSingleLine( start.coord, middleCoord, start.color, false);
                this.mdl.add(line);
                this.objects.push(line);
                line = this.createSingleLine( middleCoord, atom.coord, atom.color, false);
                this.mdl.add(line);
                this.objects.push(line);
            }
            else {
                this.createCylinder(start.coord, middleCoord, radius, start.color);
                this.createCylinder(middleCoord, atom.coord, radius, atom.color);
            }
        }
        else if(bHighlight === 1) {
            this.createCylinder(start.coord, middleCoord, radius, start.color, bHighlight);
            this.createCylinder(middleCoord, atom.coord, radius, atom.color, bHighlight);
            this.createSphere(atom, radius, true, 1, bHighlight);
        }
    }
};

iCn3D.prototype.prepareStrand = function(divPoints, positions, width, colors, div, thickness, bHighlight, bRibbon, num, pntsCA, prevCOArray, bStrip, bShowArray, calphaIdArray, bShowArrow, prevone, nexttwo) {
    if(pntsCA.length === 1) {
        return;
    }

    var colorsLastTwo = [];
    colorsLastTwo.push(colors[colors.length - 2]);
    colorsLastTwo.push(colors[colors.length - 1]);

    div = div || this.axisDIV;
    var numM1Inv2 = 2 / (num - 1);
    var delta, lastCAIndex, lastPrevCOIndex, v;

    var pnts = {}, colorsTmp = [];
    for(var i = 0, il = positions.length; i < il; ++i) pnts[i] = [];

    // smooth C-alpha
    var pnts_clrs = this.subdivide(pntsCA, colors, div, undefined, undefined, prevone, nexttwo);
    var pntsCASmooth = pnts_clrs[0]; // get all smoothen pnts, do not use 'bShowArray'
    //colors = pnts_clrs[2];

    if(pntsCASmooth.length === 1) {
        return;
    }

    // draw the sheet without the last residue
    // use the sheet coord for n-2 residues
    var colorsTmp = [];
    var lastIndex = (bShowArrow === undefined || bShowArrow) ? pntsCA.length - 2 : pntsCA.length;

    for (var i = 0, il = lastIndex; i < il; ++i) {
        for(var index = 0, indexl = positions.length; index < indexl; ++index) {
            pnts[index].push(divPoints[index][i]);
        }
        colorsTmp.push(colors[i]);
    }
    colorsTmp.push(colors[i]);

    if(bShowArrow === undefined || bShowArrow) {
        // assign the sheet coord from C-alpha for the 2nd to the last residue of the sheet
        for(var i = 0, il = positions.length; i < il; ++i) {
            delta = -1 + numM1Inv2 * positions[i];
            lastCAIndex = pntsCASmooth.length - 1 - div;
            lastPrevCOIndex = pntsCA.length - 2;
            v = new THREE.Vector3(pntsCASmooth[lastCAIndex].x + prevCOArray[lastPrevCOIndex].x * delta, pntsCASmooth[lastCAIndex].y + prevCOArray[lastPrevCOIndex].y * delta, pntsCASmooth[lastCAIndex].z + prevCOArray[lastPrevCOIndex].z * delta);
            pnts[i].push(v);
        }
    }

    var posIndex = [];
    var results;
    for(var i = 0, il = positions.length; i < il; ++i) {
        results = this.subdivide(pnts[i], colorsTmp, div, bShowArray, bHighlight);
        pnts[i] = results[0];
        colors = results[2];
        if(i === 0) {
            posIndex = results[1];
        }
    }

    if(bStrip) {
        this.createStrip(pnts[0], pnts[1], colors, div, thickness, bHighlight, true, undefined, calphaIdArray, posIndex, prevone, nexttwo);
    }
    else {
        this.createCurveSub(pnts[0], width, colors, div, bHighlight, bRibbon, true, undefined, calphaIdArray, posIndex, prevone, nexttwo);
    }

    if(bShowArrow === undefined || bShowArrow) {
        // draw the arrow
        colorsTmp = [];

        posIndex = [];
        for(var index = 0, indexl = positions.length; index < indexl; ++index) {
            pnts[index] = [];

            for (var i = div * (pntsCA.length - 2), il = div * (pntsCA.length - 1); bShowArray[parseInt(i/div)] && i < il; i = i + div) {
                var pos = parseInt(i/div);
                for (var j = 0; j < div; ++j) {
                    var delta = -1 + numM1Inv2 * positions[index];
                    var scale = 1.8; // scale of the arrow width
                    delta = delta * scale * (div - j) / div;
                    var oriIndex = parseInt(i/div);

                    var v = new THREE.Vector3(pntsCASmooth[i+j].x + prevCOArray[oriIndex].x * delta, pntsCASmooth[i+j].y + prevCOArray[oriIndex].y * delta, pntsCASmooth[i+j].z + prevCOArray[oriIndex].z * delta);
                    v.smoothen = true;
                    pnts[index].push(v);
                    colorsTmp.push(colorsLastTwo[0]);
                    if(index === 0) posIndex.push(pos);
                }
            }

            // last residue
            // make the arrow end with 0
            var delta = 0;
            var lastCAIndex = pntsCASmooth.length - 1;
            var lastPrevCOIndex = pntsCA.length - 1;

            //if(bShowArray[lastPrevCOIndex]) {
                var v = new THREE.Vector3(pntsCASmooth[lastCAIndex].x + prevCOArray[lastPrevCOIndex].x * delta, pntsCASmooth[lastCAIndex].y + prevCOArray[lastPrevCOIndex].y * delta, pntsCASmooth[lastCAIndex].z + prevCOArray[lastPrevCOIndex].z * delta);
                v.smoothen = true;
                pnts[index].push(v);
                colorsTmp.push(colorsLastTwo[1]);
                if(index === 0) posIndex.push(lastCAIndex);
            //}
        }

        pntsCASmooth = [];

        //colorsTmp.push(colors[colors.length - 2]);
        //colorsTmp.push(colors[colors.length - 1]);

        if(bStrip) {
            this.createStrip(pnts[0], pnts[1], colorsTmp, div, thickness, bHighlight, true, undefined, undefined, posIndex, prevone, nexttwo);
        }
        else {
            this.createCurveSub(pnts[0], width, colorsTmp, div, bHighlight, bRibbon, true, undefined, undefined, posIndex, prevone, nexttwo);
        }
    }

    for(var i in pnts) {
        for(var j = 0, jl = pnts[i].length; j < jl; ++j) {
            pnts[i][j] = null;
        }
        pnts[i] = [];
    }

    pnts = {};
};

iCn3D.prototype.createStripArrow = function (p0, p1, colors, div, thickness, bHighlight, num, start, end, pntsCA, prevCOArray, bShowArray, calphaIdArray, bShowArrow, prevone, nexttwo) {
    var divPoints = [], positions = [];

    divPoints.push(p0);
    divPoints.push(p1);
    positions.push(start);
    positions.push(end);

    this.prepareStrand(divPoints, positions, undefined, colors, div, thickness, bHighlight, undefined, num, pntsCA, prevCOArray, true, bShowArray, calphaIdArray, bShowArrow, prevone, nexttwo);

    divPoints = [];
    positions = [];
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createStrip = function (p0, p1, colors, div, thickness, bHighlight, bNoSmoothen, bShowArray, calphaIdArray, positions, prevone, nexttwo) {
    if (p0.length < 2) return;
    div = div || this.axisDIV;
    if(!bNoSmoothen) {
        var bExtendLastRes = true;
        var pnts_clrs0 = this.subdivide(p0, colors, div, bShowArray, bHighlight, prevone, nexttwo, bExtendLastRes);
        var pnts_clrs1 = this.subdivide(p1, colors, div, bShowArray, bHighlight, prevone, nexttwo, bExtendLastRes);
        p0 = pnts_clrs0[0];
        p1 = pnts_clrs1[0];
        colors = pnts_clrs0[2];
    }
    if (p0.length < 2) return;

    this.setCalphaDrawnCoord(p0, div, calphaIdArray);

    if(bHighlight === 1) {
        //mesh = new THREE.Mesh(geo, this.matShader);

        var radius = this.coilWidth / 2;
        //var radiusSegments = 8;
        var radiusSegments = 4; // save memory
        var closed = false;

        if(positions !== undefined) {
            var currPos, prevPos;
            var currP0 = [], currP1 = [];

            for(var i = 0, il = p0.length; i < il; ++i) {
                currPos = positions[i];

                if((currPos !== prevPos && currPos !== prevPos + 1 && prevPos !== undefined) || (i === il -1) ) {
                    // first tube
                    var geometry0 = new THREE.TubeGeometry(
                        new THREE.CatmullRomCurve3(currP0), // path
                        currP0.length, // segments
                        radius,
                        radiusSegments,
                        closed
                    );

                    mesh = new THREE.Mesh(geometry0, this.matShader);
                    mesh.renderOrder = this.renderOrderPicking;
                    //this.mdlPicking.add(mesh);
                    this.mdl.add(mesh);

                    this.prevHighlightObjects.push(mesh);

                    geometry0 = null;

                    // second tube
                    var geometry1 = new THREE.TubeGeometry(
                        new THREE.CatmullRomCurve3(currP1), // path
                        currP1.length, // segments
                        radius,
                        radiusSegments,
                        closed
                    );

                    mesh = new THREE.Mesh(geometry1, this.matShader);
                    mesh.renderOrder = this.renderOrderPicking;
                    //this.mdlPicking.add(mesh);
                    this.mdl.add(mesh);

                    this.prevHighlightObjects.push(mesh);

                    geometry1 = null;

                    currP0 = [];
                    currP1 = [];
                }

                currP0.push(p0[i]);
                currP1.push(p1[i]);

                prevPos = currPos;
            }

            currP0 = [];
            currP1 = [];
        }
        else {
            // first tube
            var geometry0 = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(p0), // path
                p0.length, // segments
                radius,
                radiusSegments,
                closed
            );

            mesh = new THREE.Mesh(geometry0, this.matShader);
            mesh.renderOrder = this.renderOrderPicking;
            //this.mdlPicking.add(mesh);
            this.mdl.add(mesh);

            this.prevHighlightObjects.push(mesh);

            geometry0 = null;

            // second tube
            var geometry1 = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(p1), // path
                p1.length, // segments
                radius,
                radiusSegments,
                closed
            );

            mesh = new THREE.Mesh(geometry1, this.matShader);
            mesh.renderOrder = this.renderOrderPicking;
            //this.mdlPicking.add(mesh);
            this.mdl.add(mesh);

            this.prevHighlightObjects.push(mesh);

            geometry1 = null;
        }
    }
    else {
        var geo = new THREE.Geometry();
        var vs = geo.vertices, fs = geo.faces;
        var axis, p0v, p1v, a0v, a1v;
        for (var i = 0, lim = p0.length; i < lim; ++i) {
            vs.push(p0v = p0[i]); // 0
            vs.push(p0v); // 1
            vs.push(p1v = p1[i]); // 2
            vs.push(p1v); // 3
            if (i < lim - 1) {
                axis = p1[i].clone().sub(p0[i]).cross(p0[i + 1].clone().sub(p0[i])).normalize().multiplyScalar(thickness);
            }
            vs.push(a0v = p0[i].clone().add(axis)); // 4
            vs.push(a0v); // 5
            vs.push(a1v = p1[i].clone().add(axis)); // 6
            vs.push(a1v); // 7
        }
        var faces = [[0, 2, -6, -8], [-4, -2, 6, 4], [7, 3, -5, -1], [-3, -7, 1, 5]];

        for (var i = 1, lim = p0.length, divInv = 1 / div; i < lim; ++i) {
            var offset = 8 * i;
            //var color = new THREE.Color(colors[Math.round((i - 1) * divInv)]);
            var color = new THREE.Color(colors[i - 1]);
            for (var j = 0; j < 4; ++j) {
                fs.push(new THREE.Face3(offset + faces[j][0], offset + faces[j][1], offset + faces[j][2], undefined, color));
                fs.push(new THREE.Face3(offset + faces[j][3], offset + faces[j][0], offset + faces[j][2], undefined, color));
            }
        }
        var vsize = vs.length - 8; // Cap
        for (var i = 0; i < 4; ++i) {
            vs.push(vs[i * 2]);
            vs.push(vs[vsize + i * 2]);
        };
        vsize += 8;
        fs.push(new THREE.Face3(vsize, vsize + 2, vsize + 6, undefined, fs[0].color));
        fs.push(new THREE.Face3(vsize + 4, vsize, vsize + 6, undefined, fs[0].color));
        fs.push(new THREE.Face3(vsize + 1, vsize + 5, vsize + 7, undefined, fs[fs.length - 3].color));
        fs.push(new THREE.Face3(vsize + 3, vsize + 1, vsize + 7, undefined, fs[fs.length - 3].color));
        geo.computeFaceNormals();
        geo.computeVertexNormals(false);

        var mesh;

        if(bHighlight === 2) {
          mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.5, specular: this.frac, shininess: 30, emissive: 0x000000, vertexColors: THREE.FaceColors, side: THREE.DoubleSide }));

          this.mdl.add(mesh);
          this.prevHighlightObjects.push(mesh);
        }
        else {
          mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ specular: this.frac, shininess: 30, emissive: 0x000000, vertexColors: THREE.FaceColors, side: THREE.DoubleSide }));

          this.mdl.add(mesh);
          this.objects.push(mesh);
        }
    }

    p0 = null;
    p1 = null;
};

// significantly modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createStrand = function (atoms, num, div, fill, coilWidth, helixSheetWidth, doNotSmoothen, thickness, bHighlight) {
    var bRibbon = fill ? true: false;

    // when highlight, the input atoms may only include part of sheet or helix
    // include the whole sheet or helix when highlighting
    var atomsAdjust = {};

    //if( (bHighlight === 1 || bHighlight === 2) && !this.bAllAtoms) {
    if( !this.bAllAtoms) {
        var currChain, currResi, currAtom, prevChain, prevResi, prevAtom;
        var firstAtom, lastAtom;
        var index = 0, length = Object.keys(atoms).length;

        atomsAdjust = this.cloneHash(atoms);
        for(var serial in atoms) {
          currChain = atoms[serial].structure + '_' + atoms[serial].chain;
          currResi = parseInt(atoms[serial].resi);
          currAtom = atoms[serial];

          if(prevChain === undefined) firstAtom = atoms[serial];

          if( (currChain !== prevChain && prevChain !== undefined) || (currResi !== prevResi && currResi !== prevResi + 1 && prevResi !== undefined) || index === length - 1) {
            if( (currChain !== prevChain && prevChain !== undefined) || (currResi !== prevResi && currResi !== prevResi + 1 && prevResi !== undefined) ) {
//              if( (currChain !== prevChain && prevChain !== undefined) || index === length - 1) {
//                if( (currChain !== prevChain && prevChain !== undefined) ) {
                lastAtom = prevAtom;
            }
            else if(index === length - 1) {
                lastAtom = currAtom;
            }

            // fill the beginning
            var beginResi = firstAtom.resi;
            if(firstAtom.ss !== 'coil' && !(firstAtom.ssbegin) ) {
                for(var i = firstAtom.resi - 1; i > 0; --i) {
                    var residueid = firstAtom.structure + '_' + firstAtom.chain + '_' + i;
                    if(!this.residues.hasOwnProperty(residueid)) break;

                    var atom = this.getFirstCalphaAtomObj(this.residues[residueid]);

                    if(atom.ss === firstAtom.ss && atom.ssbegin) {
                        beginResi = atom.resi;
                        break;
                    }
                }

                for(var i = beginResi; i < firstAtom.resi; ++i) {
                    var residueid = firstAtom.structure + '_' + firstAtom.chain + '_' + i;
                    atomsAdjust = this.unionHash(atomsAdjust, this.hash2Atoms(this.residues[residueid]));
                }
            }

            // add one extra residue for coils between strands/helix
            if(this.pk === 3 && bHighlight === 1 && firstAtom.ss === 'coil') {
                    var residueid = firstAtom.structure + '_' + firstAtom.chain + '_' + (firstAtom.resi - 1);
                    if(this.residues.hasOwnProperty(residueid)) {
                        atomsAdjust = this.unionHash(atomsAdjust, this.hash2Atoms(this.residues[residueid]));
                        atoms = this.unionHash(atoms, this.hash2Atoms(this.residues[residueid]));
                    }
            }

            // fill the end
            var endResi = lastAtom.resi;
            // when a coil connects to a sheet and the last residue of coil is highlighted, the first sheet residue is set as atom.notshow. This residue should not be shown.
            if(lastAtom.ss !== 'coil' && !(lastAtom.ssend) && !(lastAtom.notshow)) {
                var endChainResi = this.getLastAtomObj(this.chains[lastAtom.structure + '_' + lastAtom.chain]).resi;
                for(var i = lastAtom.resi + 1; i <= endChainResi; ++i) {
                    var residueid = lastAtom.structure + '_' + lastAtom.chain + '_' + i;
                    if(!this.residues.hasOwnProperty(residueid)) break;

                    var atom = this.getFirstCalphaAtomObj(this.residues[residueid]);

                    if(atom.ss === lastAtom.ss && atom.ssend) {
                        endResi = atom.resi;
                        break;
                    }
                }

                for(var i = lastAtom.resi + 1; i <= endResi; ++i) {
                    var residueid = lastAtom.structure + '_' + lastAtom.chain + '_' + i;
                    atomsAdjust = this.unionHash(atomsAdjust, this.hash2Atoms(this.residues[residueid]));
                }
            }

            // add one extra residue for coils between strands/helix
            if(this.pk === 3 && bHighlight === 1 && lastAtom.ss === 'coil') {
                    var residueid = lastAtom.structure + '_' + lastAtom.chain + '_' + (lastAtom.resi + 1);
                    if(this.residues.hasOwnProperty(residueid)) {
                        atomsAdjust = this.unionHash(atomsAdjust, this.hash2Atoms(this.residues[residueid]));
                        atoms = this.unionHash(atoms, this.hash2Atoms(this.residues[residueid]));
                    }
            }

            // reset notshow
            if(lastAtom.notshow) lastAtom.notshow = undefined;

            firstAtom = currAtom;
          }

          prevChain = currChain;
          prevResi = currResi;
          prevAtom = currAtom;

          ++index;
        }
    }
    else {
        atomsAdjust = atoms;
    }

    if(bHighlight === 2) {
        if(fill) {
            fill = false;
            num = null;
            div = null;
            coilWidth = null;
            helixSheetWidth = null;
            thickness = undefined;
        }
        else {
            fill = true;
            num = 2;
            div = undefined;
            coilWidth = undefined;
            helixSheetWidth = undefined;
            thickness = this.ribbonthickness;
        }
    }

    num = num || this.strandDIV;
    div = div || this.axisDIV;
    coilWidth = coilWidth || this.coilWidth;
    doNotSmoothen = doNotSmoothen || false;
    helixSheetWidth = helixSheetWidth || this.helixSheetWidth;
    var pnts = {}; for (var k = 0; k < num; ++k) pnts[k] = [];
    var pntsCA = [];
    var prevCOArray = [];
    var bShowArray = [];
    var calphaIdArray = []; // used to store one of the final positions drawn in 3D
    var colors = [];
    var currentChain, currentResi, currentCA = null, currentO = null, currentColor = null, prevCoorCA = null, prevCoorO = null, prevColor = null;
    var prevCO = null, ss = null, ssend = false, atomid = null, prevAtomid = null, prevResi = null, calphaid = null, prevCalphaid = null;
    var strandWidth, bSheetSegment = false, bHelixSegment = false;
    var atom, tubeAtoms = {};

    // test the first 30 atoms to see whether only C-alpha is available
    this.bCalphaOnly = this.isCalphaPhosOnly(atomsAdjust); //, 'CA');

    // when highlight, draw whole beta sheet and use bShowArray to show the highlight part
    var residueHash = {};
    for(var i in atomsAdjust) {
        var atom = atomsAdjust[i];

        residueid = atom.structure + '_' + atom.chain + '_' + atom.resi;
        residueHash[residueid] = 1;
    }
    var totalResidueCount = Object.keys(residueHash).length;

    var drawnResidueCount = 0;
    var highlightResiduesCount = 0;

    var bFullAtom = (Object.keys(this.hAtoms).length == Object.keys(this.atoms).length) ? true : false;

    var caArray = []; // record all C-alpha atoms to predict the helix

    for (var i in atomsAdjust) {
        atom = atomsAdjust[i];
        var atomOxygen = undefined;
        if ((atom.name === 'O' || atom.name === 'CA') && !atom.het) {
                // "CA" has to appear before "O"

                if (atom.name === 'CA') {
                    if ( atoms.hasOwnProperty(i) && ((atom.ss !== 'helix' && atom.ss !== 'sheet') || atom.ssend || atom.ssbegin) ) {
                        tubeAtoms[i] = atom;
                    }

                    currentCA = atom.coord;
                    currentColor = atom.color;
                    calphaid = atom.serial;

                    caArray.push(atom.serial);
                }

                if (atom.name === 'O' || (this.bCalphaOnly && atom.name === 'CA')) {
                    if(currentCA === null || currentCA === undefined) {
                        currentCA = atom.coord;
                        currentColor = atom.color;
                        calphaid = atom.serial;
                    }

                    if(atom.name === 'O') {
                        currentO = atom.coord;
                    }
                    // smoothen each coil, helix and sheet separately. The joint residue has to be included both in the previous and next segment
                    var bSameChain = true;
//                    if (currentChain !== atom.chain || currentResi + 1 !== atom.resi) {
                    if (currentChain !== atom.chain) {
                        bSameChain = false;
                    }

                    if(atom.ssend && atom.ss === 'sheet') {
                        bSheetSegment = true;
                    }
                    else if(atom.ssend && atom.ss === 'helix') {
                        bHelixSegment = true;
                    }

                    // assign the previous residue
                    if(prevCoorO) {
                        if(bHighlight === 1 || bHighlight === 2) {
                            colors.push(this.hColor);
                        }
                        else {
                            colors.push(prevColor);
                        }

                        if(ss !== 'coil' && atom.ss === 'coil') {
                            strandWidth = coilWidth;
                        }
                        else if(ssend && atom.ssbegin) { // a transition between two ss
                            strandWidth = coilWidth;
                        }
                        else {
                            strandWidth = (ss === 'coil') ? coilWidth : helixSheetWidth;
                        }

                        var O, oldCA, resSpan = 4;
                        if(atom.name === 'O') {
                            O = prevCoorO.clone();
                            if(prevCoorCA !== null && prevCoorCA !== undefined) {
                                O.sub(prevCoorCA);
                            }
                            else {
                                prevCoorCA = prevCoorO.clone();
                                if(caArray.length > resSpan + 1) { // use the calpha and the previous 4th c-alpha to calculate the helix direction
                                    O = prevCoorCA.clone();
                                    oldCA = this.atoms[caArray[caArray.length - 1 - resSpan - 1]].coord.clone();
                                    O.sub(oldCA);
                                }
                                else {
                                    O = new THREE.Vector3(Math.random(),Math.random(),Math.random());
                                }
                            }
                        }
                        else if(this.bCalphaOnly && atom.name === 'CA') {
                            if(caArray.length > resSpan + 1) { // use the calpha and the previous 4th c-alpha to calculate the helix direction
                                O = prevCoorCA.clone();
                                oldCA = this.atoms[caArray[caArray.length - 1 - resSpan - 1]].coord.clone();
                                O.sub(oldCA);
                            }
                            else {
                                O = new THREE.Vector3(Math.random(),Math.random(),Math.random());
                            }
                        }

                        O.normalize(); // can be omitted for performance
                        O.multiplyScalar(strandWidth);
                        if (prevCO !== null && O.dot(prevCO) < 0) O.negate();
                        prevCO = O;

                        for (var j = 0, numM1Inv2 = 2 / (num - 1); j < num; ++j) {
                            var delta = -1 + numM1Inv2 * j;
                            var v = new THREE.Vector3(prevCoorCA.x + prevCO.x * delta, prevCoorCA.y + prevCO.y * delta, prevCoorCA.z + prevCO.z * delta);
                            if (!doNotSmoothen && ss === 'sheet') v.smoothen = true;
                            pnts[j].push(v);
                        }

                        pntsCA.push(prevCoorCA);
                        prevCOArray.push(prevCO);

                        if(atoms.hasOwnProperty(prevAtomid)) {
                            bShowArray.push(prevResi);
                            calphaIdArray.push(prevCalphaid);

                            ++highlightResiduesCount;
                        }
                        else {
                            bShowArray.push(0);
                            calphaIdArray.push(0);
                        }

                        ++drawnResidueCount;
                    }

                    //var maxDist = 6.0;
                    //var bBrokenSs = (prevCoorCA && Math.abs(currentCA.x - prevCoorCA.x) > maxDist) || (prevCoorCA && Math.abs(currentCA.y - prevCoorCA.y) > maxDist) || (prevCoorCA && Math.abs(currentCA.z - prevCoorCA.z) > maxDist);

                    if ((atom.ssbegin || atom.ssend || (drawnResidueCount === totalResidueCount - 1)) && pnts[0].length > 0 && bSameChain) {
                        var atomName = 'CA';

                        var prevone = [], nexttwo = [];

                        var prevoneResid = this.atoms[prevAtomid].structure + '_' + this.atoms[prevAtomid].chain + '_' + (this.atoms[prevAtomid].resi - 1).toString();
                        var prevoneCoord = this.getAtomCoordFromResi(prevoneResid, atomName);
                        prevone = (prevoneCoord !== undefined) ? [prevoneCoord] : [];

                        var nextoneResid = this.atoms[prevAtomid].structure + '_' + this.atoms[prevAtomid].chain + '_' + (this.atoms[prevAtomid].resi + 1).toString();
                        var nextoneCoord = this.getAtomCoordFromResi(nextoneResid, atomName);
                        if(nextoneCoord !== undefined) {
                            nexttwo.push(nextoneCoord);
                        }

                        var nexttwoResid = this.atoms[prevAtomid].structure + '_' + this.atoms[prevAtomid].chain + '_' + (this.atoms[prevAtomid].resi + 2).toString();
                        var nexttwoCoord = this.getAtomCoordFromResi(nexttwoResid, atomName);
                        if(nexttwoCoord !== undefined) {
                            nexttwo.push(nexttwoCoord);
                        }

                        // assign the current joint residue to the previous segment
                        if(bHighlight === 1 || bHighlight === 2) {
                            colors.push(this.hColor);
                        }
                        else {
                            //colors.push(atom.color);
                            colors.push(prevColor);
                        }

                        if(atom.ssend && atom.ss === 'sheet') { // current residue is the end of ss and is the end of arrow
                            strandWidth = 0; // make the arrow end sharp
                        }
                        else if(ss === 'coil' && atom.ssbegin) {
                            strandWidth = coilWidth;
                        }
                        else if(ssend && atom.ssbegin) { // current residue is the start of ss and  the previous residue is the end of ss, then use coil
                            strandWidth = coilWidth;
                        }
                        else { // use the ss from the previous residue
                            strandWidth = (atom.ss === 'coil') ? coilWidth : helixSheetWidth;
                        }

                        var O, oldCA, resSpan = 4;
                        if(atom.name === 'O') {
                            O = currentO.clone();
                            O.sub(currentCA);
                        }
                        else if(this.bCalphaOnly && atom.name === 'CA') {
                            if(caArray.length > resSpan) { // use the calpha and the previous 4th c-alpha to calculate the helix direction
                                O = currentCA.clone();
                                oldCA = this.atoms[caArray[caArray.length - 1 - resSpan]].coord.clone();
                                O.sub(oldCA);
                            }
                            else {
                                O = new THREE.Vector3(Math.random(),Math.random(),Math.random());
                            }
                        }

                        O.normalize(); // can be omitted for performance
                        O.multiplyScalar(strandWidth);
                        if (prevCO !== null && O.dot(prevCO) < 0) O.negate();
                        prevCO = O;

                        for (var j = 0, numM1Inv2 = 2 / (num - 1); j < num; ++j) {
                            var delta = -1 + numM1Inv2 * j;
                            var v = new THREE.Vector3(currentCA.x + prevCO.x * delta, currentCA.y + prevCO.y * delta, currentCA.z + prevCO.z * delta);
                            if (!doNotSmoothen && ss === 'sheet') v.smoothen = true;
                            pnts[j].push(v);
                        }

                        atomid = atom.serial;

                        pntsCA.push(currentCA);
                        prevCOArray.push(prevCO);

                        // when a coil connects to a sheet and the last residue of coild is highlighted, the first sheet residue is set as atom.highlightStyle. This residue should not be shown.
                        //if(atoms.hasOwnProperty(atomid) && (bHighlight === 1 && !atom.notshow) ) {
                        if(atoms.hasOwnProperty(atomid)) {
                            bShowArray.push(atom.resi);
                            calphaIdArray.push(calphaid);
                        }
                        else {
                            bShowArray.push(0);
                            calphaIdArray.push(0);
                        }

                        // draw the current segment
                        for (var j = 0; !fill && j < num; ++j) {
                            if(bSheetSegment) {
                                this.createCurveSubArrow(pnts[j], 1, colors, div, bHighlight, bRibbon, num, j, pntsCA, prevCOArray, bShowArray, calphaIdArray, true, prevone, nexttwo);
                            }
                            else if(bHelixSegment) {
                                if(bFullAtom) {
                                    this.createCurveSub(pnts[j], 1, colors, div, bHighlight, bRibbon, false, bShowArray, calphaIdArray, undefined, prevone, nexttwo);
                                }
                                else {
                                    this.createCurveSubArrow(pnts[j], 1, colors, div, bHighlight, bRibbon, num, j, pntsCA, prevCOArray, bShowArray, calphaIdArray, false, prevone, nexttwo);
                                }
                            }
                        }
                        if (fill) {
                            if(bSheetSegment) {
                                var start = 0, end = num - 1;
                                this.createStripArrow(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, num, start, end, pntsCA, prevCOArray, bShowArray, calphaIdArray, true, prevone, nexttwo);
                            }
                            else if(bHelixSegment) {
                                if(bFullAtom) {
                                    this.createStrip(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, false, bShowArray, calphaIdArray, undefined, prevone, nexttwo);
                                }
                                else {
                                    var start = 0, end = num - 1;
                                    this.createStripArrow(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, num, start, end, pntsCA, prevCOArray, bShowArray, calphaIdArray, true, prevone, nexttwo);
                                }
                            }
                            else {
                                if(bHighlight === 2) { // draw coils only when highlighted. if not highlighted, coils will be drawn as tubes separately
                                    this.createStrip(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, false, bShowArray, calphaIdArray, undefined, prevone, nexttwo);
                                }
                            }
                        }
                        for (var k = 0; k < num; ++k) pnts[k] = [];

                        colors = [];
                        pntsCA = [];
                        prevCOArray = [];
                        bShowArray = [];
                        calphaIdArray = [];
                        bSheetSegment = false;
                        bHelixSegment = false;
                    } // end if (atom.ssbegin || atom.ssend)

                    // end of a chain
//                    if ((currentChain !== atom.chain || currentResi + 1 !== atom.resi) && pnts[0].length > 0) {
                    if ((currentChain !== atom.chain) && pnts[0].length > 0) {

                        var atomName = 'CA';

                        var prevoneResid = this.atoms[prevAtomid].structure + '_' + this.atoms[prevAtomid].chain + '_' + (this.atoms[prevAtomid].resi - 1).toString();
                        var prevoneCoord = this.getAtomCoordFromResi(prevoneResid, atomName);
                        var prevone = (prevoneCoord !== undefined) ? [prevoneCoord] : [];

                        var nexttwo = [];

                        for (var j = 0; !fill && j < num; ++j) {
                            if(bSheetSegment) {
                                this.createCurveSubArrow(pnts[j], 1, colors, div, bHighlight, bRibbon, num, j, pntsCA, prevCOArray, bShowArray, calphaIdArray, true, prevone, nexttwo);
                            }
                            else if(bHelixSegment) {
                                if(bFullAtom) {
                                    this.createCurveSub(pnts[j], 1, colors, div, bHighlight, bRibbon, false, bShowArray, calphaIdArray, undefined, prevone, nexttwo);
                                }
                                else {
                                    this.createCurveSubArrow(pnts[j], 1, colors, div, bHighlight, bRibbon, num, j, pntsCA, prevCOArray, bShowArray, calphaIdArray, false, prevone, nexttwo);
                                }
                            }
                        }
                        if (fill) {
                            if(bSheetSegment) {
                                var start = 0, end = num - 1;
                                this.createStripArrow(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, num, start, end, pntsCA, prevCOArray, bShowArray, calphaIdArray, true, prevone, nexttwo);
                            }
                            else if(bHelixSegment) {
                                if(bFullAtom) {
                                    this.createStrip(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, false, bShowArray, calphaIdArray, undefined, prevone, nexttwo);
                                }
                                else {
                                    var start = 0, end = num - 1;
                                    this.createStripArrow(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight, num, start, end, pntsCA, prevCOArray, bShowArray, calphaIdArray, false, prevone, nexttwo);
                                }
                            }
                        }

                        for (var k = 0; k < num; ++k) pnts[k] = [];
                        colors = [];
                        pntsCA = [];
                        prevCOArray = [];
                        bShowArray = [];
                        calphaIdArray = [];
                        bSheetSegment = false;
                        bHelixSegment = false;
                    }

                    currentChain = atom.chain;
                    currentResi = atom.resi;
                    ss = atom.ss;
                    ssend = atom.ssend;
                    prevAtomid = atom.serial;
                    prevResi = atom.resi;

                    prevCalphaid = calphaid;

                    // only update when atom.name === 'O'
                    prevCoorCA = currentCA;
                    prevCoorO = atom.coord;
                    prevColor = currentColor;
                } // end if (atom.name === 'O' || (this.bCalphaOnly && atom.name === 'CA') ) {
        } // end if ((atom.name === 'O' || atom.name === 'CA') && !atom.het) {
    } // end for

    caArray = [];

    this.createTube(tubeAtoms, 'CA', coilWidth, bHighlight);

    tubeAtoms = {};
    pnts = {};
};

/*
iCn3D.prototype.createStrandBrick = function (brick, color, thickness, bHighlight) {
    var num = this.strandDIV;
    var div = this.axisDIV;
    var doNotSmoothen = false;
    var helixSheetWidth = this.helixSheetWidth;

    if(bHighlight === 2) {
        thickness *= 1.5;
        helixSheetWidth *= 1.5;
    }

    var pnts = {}; for (var k = 0; k < num; ++k) pnts[k] = [];
    var colors = [];
    var prevCO = null, ss = null;
    for (var i = 0; i < 2; ++i) {
        var currentCA = brick.coords[i];

        colors.push(new THREE.Color(color));

        var O = new THREE.Vector3(brick.coords[2].x, brick.coords[2].y, brick.coords[2].z);
        O.normalize();

        O.multiplyScalar(helixSheetWidth);
        if (prevCO !== null && O.dot(prevCO) < 0) O.negate();
        prevCO = O;
        for (var j = 0, numM1Inv2 = 2 / (num - 1); j < num; ++j) {
            var delta = -1 + numM1Inv2 * j;
            var v = new THREE.Vector3(currentCA.x + prevCO.x * delta, currentCA.y + prevCO.y * delta, currentCA.z + prevCO.z * delta);
            if (!doNotSmoothen) v.smoothen = true;
            pnts[j].push(v);
        }
    }
    this.createStrip(pnts[0], pnts[num - 1], colors, div, thickness, bHighlight);
};
*/

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createTubeSub = function (_pnts, colors, radii, bHighlight, prevone, nexttwo) {
    if (_pnts.length < 2) return;
    var circleDiv = this.tubeDIV, axisDiv = this.axisDIV;
    var circleDivInv = 1 / circleDiv, axisDivInv = 1 / axisDiv;
    var geo = new THREE.Geometry();
    var pnts_clrs = this.subdivide(_pnts, colors, axisDiv, undefined, undefined, prevone, nexttwo);

    var pnts = pnts_clrs[0];
    colors = pnts_clrs[2];

    var prevAxis1 = new THREE.Vector3(), prevAxis2;
    for (var i = 0, lim = pnts.length; i < lim; ++i) {
        var r, idx = (i - 1) * axisDivInv;
        if (i === 0) r = radii[0];
        else {
            if (idx % 1 === 0) r = radii[idx];
            else {
                var floored = Math.floor(idx);
                var tmp = idx - floored;
                r = radii[floored] * tmp + radii[floored + 1] * (1 - tmp);
            }
        }
        var delta, axis1, axis2;
        if (i < lim - 1) {
            delta = pnts[i].clone().sub(pnts[i + 1]);
            axis1 = new THREE.Vector3(0, -delta.z, delta.y).normalize().multiplyScalar(r);
            axis2 = delta.clone().cross(axis1).normalize().multiplyScalar(r);
            //      var dir = 1, offset = 0;
            if (prevAxis1.dot(axis1) < 0) {
                axis1.negate(); axis2.negate();  //dir = -1;//offset = 2 * Math.PI / axisDiv;
            }
            prevAxis1 = axis1; prevAxis2 = axis2;
        } else {
            axis1 = prevAxis1; axis2 = prevAxis2;
        }
        for (var j = 0; j < circleDiv; ++j) {
            var angle = 2 * Math.PI * circleDivInv * j; //* dir  + offset;
            geo.vertices.push(pnts[i].clone().add(axis1.clone().multiplyScalar(Math.cos(angle))).add(axis2.clone().multiplyScalar(Math.sin(angle))));
        }
    }
    var offset = 0;
    for (var i = 0, lim = pnts.length - 1; i < lim; ++i) {
        //var c = new THREE.Color(colors[Math.round((i - 1) * axisDivInv)]);
        var c = new THREE.Color(colors[i]);

        var reg = 0;
        var r1 = geo.vertices[offset].clone().sub(geo.vertices[offset + circleDiv]).lengthSq();
        var r2 = geo.vertices[offset].clone().sub(geo.vertices[offset + circleDiv + 1]).lengthSq();
        if (r1 > r2) { r1 = r2; reg = 1; };
        for (var j = 0; j < circleDiv; ++j) {
            geo.faces.push(new THREE.Face3(offset + j, offset + (j + reg) % circleDiv + circleDiv, offset + (j + 1) % circleDiv, undefined, c));
            geo.faces.push(new THREE.Face3(offset + (j + 1) % circleDiv, offset + (j + reg) % circleDiv + circleDiv, offset + (j + reg + 1) % circleDiv + circleDiv, undefined, c));
        }
        offset += circleDiv;
    }
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);

    var mesh;
    if(bHighlight === 2) {
      mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.5, specular: this.frac, shininess: 30, emissive: 0x000000, vertexColors: THREE.FaceColors, side: THREE.DoubleSide }));
      this.mdl.add(mesh);
    }
    else if(bHighlight === 1) {
      mesh = new THREE.Mesh(geo, this.matShader);
      mesh.renderOrder = this.renderOrderPicking;
      //this.mdlPicking.add(mesh);
      this.mdl.add(mesh);
    }
    else {
      mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ specular: this.frac, shininess: 30, emissive: 0x000000, vertexColors: THREE.FaceColors, side: THREE.DoubleSide }));
      this.mdl.add(mesh);
    }

    if(bHighlight === 1 || bHighlight === 2) {
        this.prevHighlightObjects.push(mesh);
    }
    else {
        this.objects.push(mesh);
    }
};

iCn3D.prototype.getAtomCoordFromResi = function (resid, atomName) {
    if(this.residues.hasOwnProperty(resid)) {
        for(var i in this.residues[resid]) {
            if(this.atoms[i].name === atomName && !this.atoms[i].het) {
                var coord = (this.atoms[i].coord2 !== undefined) ? this.atoms[i].coord2 : this.atoms[i].coord;

                return coord;
            }
        }
    }

    return undefined;
}

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createTube = function (atoms, atomName, radius, bHighlight) {
    var pnts = [], colors = [], radii = [], prevone = [], nexttwo = [];
    var currentChain, currentResi;
    var index = 0;
    var prevAtom;
    var maxDist = 6.0;
    var maxDist2 = 3.0; // avoid tube between the residues in 3 residue helix

    var pnts_colors_radii_prevone_nexttwo = [];
    var firstAtom, atom;

    for (var i in atoms) {
        atom = atoms[i];
        if ((atom.name === atomName) && !atom.het) {
            if(index == 0) {
                firstAtom = atom;
            }

            //if (index > 0 && (currentChain !== atom.chain || currentResi + 1 !== atom.resi || Math.abs(atom.coord.x - prevAtom.coord.x) > maxDist || Math.abs(atom.coord.y - prevAtom.coord.y) > maxDist || Math.abs(atom.coord.z - prevAtom.coord.z) > maxDist) ) {
            if (index > 0 && (currentChain !== atom.chain || Math.abs(atom.coord.x - prevAtom.coord.x) > maxDist || Math.abs(atom.coord.y - prevAtom.coord.y) > maxDist || Math.abs(atom.coord.z - prevAtom.coord.z) > maxDist
              || (currentResi + 1 !== atom.resi && (Math.abs(atom.coord.x - prevAtom.coord.x) > maxDist2 || Math.abs(atom.coord.y - prevAtom.coord.y) > maxDist2 || Math.abs(atom.coord.z - prevAtom.coord.z) > maxDist2) )
              ) ) {
                if(bHighlight !== 2) {
                    //this.createTubeSub(pnts, colors, radii, bHighlight);
                    var prevoneResid = firstAtom.structure + '_' + firstAtom.chain + '_' + (firstAtom.resi - 1).toString();
                    var prevoneCoord = this.getAtomCoordFromResi(prevoneResid, atomName);
                    prevone = (prevoneCoord !== undefined) ? [prevoneCoord] : [];

                    var nextoneResid = prevAtom.structure + '_' + prevAtom.chain + '_' + (prevAtom.resi + 1).toString();
                    var nextoneCoord = this.getAtomCoordFromResi(nextoneResid, atomName);
                    if(nextoneCoord !== undefined) {
                        nexttwo.push(nextoneCoord);
                    }

                    var nexttwoResid = prevAtom.structure + '_' + prevAtom.chain + '_' + (prevAtom.resi + 2).toString();
                    var nexttwoCoord = this.getAtomCoordFromResi(nexttwoResid, atomName);
                    if(nexttwoCoord !== undefined) {
                        nexttwo.push(nexttwoCoord);
                    }

                    pnts_colors_radii_prevone_nexttwo.push({'pnts':pnts, 'colors':colors, 'radii':radii, 'prevone':prevone, 'nexttwo':nexttwo});
                }
                pnts = []; colors = []; radii = []; prevone = []; nexttwo = [];
                firstAtom = atom;
                index = 0;
            }
            pnts.push(atom.coord);

            var radiusFinal = radius;
            if(radius) {
                radiusFinal = radius;
            }
            else {
                if(atom.b > 0 && atom.b <= 100) {
                    radiusFinal = atom.b * 0.01;
                }
                else if(atom.b > 100) {
                    radiusFinal = 100 * 0.01;
                }
                else {
                    radiusFinal = this.coilWidth;
                }
            }

            //radii.push(radius || (atom.b > 0 ? atom.b * 0.01 : this.coilWidth));
            radii.push(radiusFinal);

            colors.push(atom.color);
            // the starting residue of a coil uses the color from thenext residue to avoid using the color of the last helix/sheet residue
            if(index === 1) colors[colors.length - 2] = atom.color;

            currentChain = atom.chain;
            currentResi = atom.resi;

            var scale = 1.2;
            if(bHighlight === 2 && !atom.ssbegin) {
                this.createBox(atom, undefined, undefined, scale, undefined, bHighlight);
            }

            ++index;

            prevAtom = atom;
        }
    }
    if(bHighlight !== 2) {
        //this.createTubeSub(pnts, colors, radii, bHighlight);

        prevone = [];
        if(firstAtom !== undefined) {
            var prevoneResid = firstAtom.structure + '_' + firstAtom.chain + '_' + (firstAtom.resi - 1).toString();
            var prevoneCoord = this.getAtomCoordFromResi(prevoneResid, atomName);
            prevone = (prevoneCoord !== undefined) ? [prevoneCoord] : [];
        }

        nexttwo = [];
        if(atom !== undefined) {
            var nextoneResid = atom.structure + '_' + atom.chain + '_' + (atom.resi + 1).toString();
            var nextoneCoord = this.getAtomCoordFromResi(nextoneResid, atomName);
            if(nextoneCoord !== undefined) {
                nexttwo.push(nextoneCoord);
            }

            var nexttwoResid = atom.structure + '_' + atom.chain + '_' + (atom.resi + 2).toString();
            var nexttwoCoord = this.getAtomCoordFromResi(nexttwoResid, atomName);
            if(nexttwoCoord !== undefined) {
                nexttwo.push(nexttwoCoord);
            }
        }

        pnts_colors_radii_prevone_nexttwo.push({'pnts':pnts, 'colors':colors, 'radii':radii, 'prevone':prevone, 'nexttwo':nexttwo});
    }

    for(var i = 0, il = pnts_colors_radii_prevone_nexttwo.length; i < il; ++i) {
        var pnts = pnts_colors_radii_prevone_nexttwo[i].pnts;
        var colors = pnts_colors_radii_prevone_nexttwo[i].colors;
        var radii = pnts_colors_radii_prevone_nexttwo[i].radii;
        var prevone = pnts_colors_radii_prevone_nexttwo[i].prevone;
        var nexttwo = pnts_colors_radii_prevone_nexttwo[i].nexttwo;

        this.createTubeSub(pnts, colors, radii, bHighlight, prevone, nexttwo);
    }

    pnts_colors_radii_prevone_nexttwo = [];
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createCylinderHelix = function (atoms, radius, bHighlight) {
    var start = null;
    var currentChain, currentResi;
    var others = {}, beta = {};
    var i;
    for (i in atoms) {
        var atom = atoms[i];
        if (atom.het) continue;
        if ((atom.ss !== 'helix' && atom.ss !== 'sheet') || atom.ssend || atom.ssbegin) others[atom.serial] = atom;
        if (atom.ss === 'sheet') beta[atom.serial] = atom;
        if (atom.name !== 'CA') continue;
        if (atom.ss === 'helix' && atom.ssend) {
            if (start !== null && currentChain === atom.chain && currentResi < atom.resi) {
                if(bHighlight === 1 || bHighlight === 2) {
                    this.createCylinder(start.coord, atom.coord, radius, this.hColor, bHighlight);
                }
                else {
                    this.createCylinder(start.coord, atom.coord, radius, atom.color);
                }
            }

            start = null;
        }

        if (start === null && atom.ss === 'helix' && atom.ssbegin) {
            start = atom;

            currentChain = atom.chain;
            currentResi = atom.resi;
        }
    }

    if(bHighlight === 1 || bHighlight === 2) {
        if(Object.keys(others).length > 0) this.createTube(others, 'CA', this.coilWidth, bHighlight);
        if(Object.keys(beta).length > 0) this.createStrand(beta, undefined, undefined, true, 0, this.helixSheetWidth, false, this.ribbonthickness * 2, bHighlight);
    }
    else {
        if(Object.keys(others).length > 0) this.createTube(others, 'CA', this.coilWidth);
        if(Object.keys(beta).length > 0) this.createStrand(beta, undefined, undefined, true, 0, this.helixSheetWidth, false, this.ribbonthickness * 2);
    }
};

// modified from GLmol (http://webglmol.osdn.jp/index-en.html)
iCn3D.prototype.drawNucleicAcidStick = function(atomlist, bHighlight) {
   var currentChain, currentResi, start = null, end = null;
   var i;

   for (i in atomlist) {
      var atom = atomlist[i];
      if (atom === undefined || atom.het) continue;

      if (atom.resi !== currentResi || atom.chain !== currentChain) {
         if (start !== null && end !== null) {
            this.createCylinder(new THREE.Vector3(start.coord.x, start.coord.y, start.coord.z),
                              new THREE.Vector3(end.coord.x, end.coord.y, end.coord.z), this.cylinderRadius, start.color, bHighlight);
         }
         start = null; end = null;
      }
      if (atom.name === 'O3\'' || atom.name === 'O3*') start = atom;
      if (atom.resn === '  A' || atom.resn === '  G' || atom.resn === ' DA' || atom.resn === ' DG') {
         if (atom.name === 'N1')  end = atom; //  N1(AG), N3(CTU)
      } else if (atom.name === 'N3') {
         end = atom;
      }
      currentResi = atom.resi; currentChain = atom.chain;
   }
   if (start !== null && end !== null)
      this.createCylinder(new THREE.Vector3(start.coord.x, start.coord.y, start.coord.z),
                        new THREE.Vector3(end.coord.x, end.coord.y, end.coord.z), this.cylinderRadius, start.color, bHighlight);
};

//iCn3D.prototype.isCalphaPhosOnly = function(atomlist, atomname1, atomname2) {
iCn3D.prototype.isCalphaPhosOnly = function(atomlist) {
      var bCalphaPhosOnly = false;

      var index = 0, testLength = 50; //30
      //var bOtherAtoms = false;
      var nOtherAtoms = 0;
      for(var i in atomlist) {
        if(index < testLength) {
          if(atomlist[i].name !== "CA" && atomlist[i].name !== "P" && atomlist[i].name !== "O3'" && atomlist[i].name !== "O3*") {
            //bOtherAtoms = true;
            //break;
            ++nOtherAtoms;
          }
        }
        else {
          break;
        }

        ++index;
      }

      //if(!bOtherAtoms) {
      if(nOtherAtoms < 0.5 * index) {
        bCalphaPhosOnly = true;
      }

      return bCalphaPhosOnly;
};

// modified from GLmol (http://webglmol.osdn.jp/index-en.html)
iCn3D.prototype.drawCartoonNucleicAcid = function(atomlist, div, thickness, bHighlight) {
   this.drawStrandNucleicAcid(atomlist, 2, div, true, undefined, thickness, bHighlight);
};

// modified from GLmol (http://webglmol.osdn.jp/index-en.html)
iCn3D.prototype.drawStrandNucleicAcid = function(atomlist, num, div, fill, nucleicAcidWidth, thickness, bHighlight) {
   if(bHighlight === 2) {
       num = undefined;
       thickness = undefined;
   }

   nucleicAcidWidth = nucleicAcidWidth || this.nucleicAcidWidth;
   div = div || this.axisDIV;
   num = num || this.nucleicAcidStrandDIV;
   var i, j, k;
   var pnts = []; for (k = 0; k < num; k++) pnts[k] = [];
   var colors = [];
   var currentChain, currentResi, currentO3;
   var prevOO = null;

   for (i in atomlist) {
      var atom = atomlist[i];
      if (atom === undefined) continue;

      if ((atom.name === 'O3\'' || atom.name === 'OP2' || atom.name === 'O3*' || atom.name === 'O2P') && !atom.het) {
         if (atom.name === 'O3\'' || atom.name === 'O3*') { // to connect 3' end. FIXME: better way to do?
            if (currentChain !== atom.chain || currentResi + 1 !== atom.resi) {
//            if (currentChain !== atom.chain) {
               if (currentO3 && prevOO) {
                  for (j = 0; j < num; j++) {
                     var delta = -1 + 2 / (num - 1) * j;
                     pnts[j].push(new THREE.Vector3(currentO3.x + prevOO.x * delta,
                      currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
                  }
               }
               if (fill) this.createStrip(pnts[0], pnts[1], colors, div, thickness, bHighlight);
               for (j = 0; !thickness && j < num; j++)
                  this.createCurveSub(pnts[j], 1 ,colors, div, bHighlight);
               var pnts = []; for (k = 0; k < num; k++) pnts[k] = [];
               colors = [];
               prevOO = null;
            }
            currentO3 = new THREE.Vector3(atom.coord.x, atom.coord.y, atom.coord.z);
            currentChain = atom.chain;
            currentResi = atom.resi;
            if(bHighlight === 1 || bHighlight === 2) {
                colors.push(this.hColor);
            }
            else {
                colors.push(atom.color);
            }

         }
         else if (atom.name === 'OP2' || atom.name === 'O2P') {
            if (!currentO3) {prevOO = null; continue;} // for 5' phosphate (e.g. 3QX3)
            var O = new THREE.Vector3(atom.coord.x, atom.coord.y, atom.coord.z);
            O.sub(currentO3);
            O.normalize().multiplyScalar(nucleicAcidWidth);  // TODO: refactor
            //if (prevOO !== undefined && O.dot(prevOO) < 0) {
            if (prevOO !== null && O.dot(prevOO) < 0) {
               O.negate();
            }
            prevOO = O;
            for (j = 0; j < num; j++) {
               var delta = -1 + 2 / (num - 1) * j;
               pnts[j].push(new THREE.Vector3(currentO3.x + prevOO.x * delta,
                 currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
            }
            currentO3 = null;
         }
      }
   }

   if (currentO3 && prevOO) {
      for (j = 0; j < num; j++) {
         var delta = -1 + 2 / (num - 1) * j;
         pnts[j].push(new THREE.Vector3(currentO3.x + prevOO.x * delta,
           currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
      }
   }
   if (fill) this.createStrip(pnts[0], pnts[1], colors, div, thickness, bHighlight);
   for (j = 0; !thickness && j < num; j++)
      this.createCurveSub(pnts[j], 1 ,colors, div, bHighlight);
};

iCn3D.prototype.createSingleLine = function ( src, dst, colorHex, dashed, dashSize ) {
    var geom = new THREE.Geometry();
    var mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: dashSize, gapSize: 0.5*dashSize });
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
    }

    geom.vertices.push( src );
    geom.vertices.push( dst );
    if(dashed) geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    //var axis = new THREE.Line( geom, mat, THREE.LineSegments );
    var axis = new THREE.LineSegments( geom, mat );

    return axis;
};

// used for highlight
iCn3D.prototype.createBox = function (atom, defaultRadius, forceDefault, scale, color, bHighlight) {
    var mesh;

    if(defaultRadius === undefined) defaultRadius = 0.8;
    if(forceDefault === undefined) forceDefault = false;
    if(scale === undefined) scale = 0.8;

    if(bHighlight) {
        if(color === undefined) color = this.hColor;

          mesh = new THREE.Mesh(this.boxGeometry, new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.5, specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));
    }
    else {
        if(color === undefined) color = atom.color;

          mesh = new THREE.Mesh(this.boxGeometry, new THREE.MeshPhongMaterial({ specular: this.frac, shininess: 30, emissive: 0x000000, color: color }));
    }

    mesh.scale.x = mesh.scale.y = mesh.scale.z = forceDefault ? defaultRadius : (this.vdwRadii[atom.elem] || defaultRadius) * (scale ? scale : 1);
    mesh.position.copy(atom.coord);
    this.mdl.add(mesh);

    if(bHighlight) {
        this.prevHighlightObjects.push(mesh);
    }
    else {
        this.objects.push(mesh);
    }
};

// modified from 3Dmol (http://3dmol.csb.pitt.edu/)
// new: http://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
// old: http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
iCn3D.prototype.makeTextSprite = function ( message, parameters ) {

    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;

    var a = parameters.hasOwnProperty("alpha") ? parameters["alpha"] : 1.0;

    var bBkgd = true;
    var bSchematic = false;
    if(parameters.hasOwnProperty("bSchematic") &&  parameters["bSchematic"]) {
        bSchematic = true;

        fontsize = 40;
    }

    var backgroundColor, borderColor, borderThickness;
    if(parameters.hasOwnProperty("backgroundColor") &&  parameters["backgroundColor"] !== undefined) {
        backgroundColor = this.hexToRgb(parameters["backgroundColor"], a);

        borderColor = parameters.hasOwnProperty("borderColor") ? this.hexToRgb(parameters["borderColor"], a) : { r:0, g:0, b:0, a:1.0 };
        borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    }
    else {
        bBkgd = false;
        backgroundColor = undefined;
        borderColor = undefined;
        borderThickness = 0;
    }

    var textAlpha = 1.0;
    var textColor = parameters.hasOwnProperty("textColor") &&  parameters["textColor"] !== undefined ? this.hexToRgb(parameters["textColor"], textAlpha) : { r:255, g:255, b:0, a:1.0 };

    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');

    context.font = "Bold " + fontsize + "px " + fontface;

    var metrics = context.measureText( message );

    var textWidth = metrics.width;

    var width = textWidth + 2*borderThickness;
    var height = fontsize + 2*borderThickness;

    if(bSchematic) {
        if(width > height) {
            height = width;
        }
        else {
            width = height;
        }
    }

    //var factor = (bSchematic) ? 3 * this.oriMaxD / 100 : 3 * this.oriMaxD / 100;
    var factor = (bSchematic) ? 3 * this.maxD / 100 : 3 * this.maxD / 100;

    var expandWidthFactor = 0.8 * textWidth / height;

/*
    // define width and height will make long text be squashed, but make the label to appear at the exact location
    if(bSchematic || message.length <= textLengthThreshold) {
        canvas.width = width;
        canvas.height = height;

        factor = 3 * this.oriMaxD / 100;
    }
*/

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    //var radius = context.measureText( "M" ).width;

    if(bBkgd) {
        // background color
        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;

        if(bSchematic) {
            var r = width * 0.35;
            this.circle(context, 0, 0, width, height, r);
        }
        else {
            //var r = (message.length <= textLengthThreshold) ? height * 0.5 : 0;
            //var r = height * 0.8;
            var r = 0;
            this.roundRect(context, 0, 0, width, height, r);
        }
    }

    // need to redefine again
    context.font = "Bold " + fontsize + "px " + fontface;

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.strokeStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";

    context.fillText( message, width * 0.5, height * 0.5);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var frontOfTarget = true;
    //var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var spriteMaterial = new THREE.SpriteMaterial( {
        map: texture,
        //useScreenCoordinates: false,
        depthTest: !frontOfTarget,
        depthWrite: !frontOfTarget
    } );

    //https://stackoverflow.com/questions/29421702/threejs-texture
    spriteMaterial.map.minFilter = THREE.LinearFilter;

    var sprite = new THREE.Sprite( spriteMaterial );

    if(bSchematic) {
        sprite.scale.set(factor, factor, 1.0);
    }
    else {
        sprite.scale.set(expandWidthFactor * factor, factor, 1.0);
    }

    return sprite;
};

// function for drawing rounded rectangles
iCn3D.prototype.roundRect = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};

iCn3D.prototype.circle = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.arc(x+w/2, y+h/2, r, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};

// modified from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.createLabelRepresentation = function (labels) {
    var tmpMaxD = this.maxD;

    for(var name in labels) {
        var labelArray = (labels[name] !== undefined) ? labels[name] : [];

        for (var i = 0, il = labelArray.length; i < il; ++i) {
            var label = labelArray[i];
            // make sure fontsize is a number

            if(label.size == 0) label.size = undefined;
            if(label.color == 0) label.color = undefined;
            if(label.background == 0) label.background = undefined;

            var labelsize = (label.size !== undefined) ? label.size : this.LABELSIZE;
            var labelcolor = (label.color !== undefined) ? label.color : '#ffff00';
            var labelbackground = (label.background !== undefined) ? label.background : '#cccccc';
            var labelalpha = (label.alpha !== undefined) ? label.alpha : 1.0;
            // if label.background is undefined, no background will be drawn
            labelbackground = label.background;

            if(labelcolor !== undefined && labelbackground !== undefined && labelcolor.toLowerCase() === labelbackground.toLowerCase()) {
                labelcolor = "#888888";
            }

            var bChemicalInProteinOrTrace = false;
            var bStick = false;
            if(Object.keys(this.proteins).length + Object.keys(this.nucleotides).length > 0) {
                var firstAtom = this.getFirstAtomObj(this.hAtoms);
                if(firstAtom !== undefined) {
                    if(this.chemicals.hasOwnProperty(firstAtom.serial)
                      || firstAtom.style == 'c alpha trace' || firstAtom.style == 'o3 trace'
                      //|| firstAtom.style == 'schematic'
                      ) {
                        bChemicalInProteinOrTrace = true;
                    }

                    if(firstAtom.style == 'stick' || firstAtom.style == 'ball and stick') {
                        bStick = true;
                    }
                }
            }

            // somehow the transformation is not stable when reset camera
/*
            if(bChemicalInProteinOrTrace) {
                this.maxD = 15; // 50
                this.setCamera();
            }
            else if(bStick) {
                this.maxD = 30; // 50
                this.setCamera();
            }
            else {
                if(Object.keys(this.proteins).length + Object.keys(this.nucleotides).length > 0) {
                    this.maxD = 100;
                    this.setCamera();
                }
                else {
                    this.maxD = 15;
                    this.setCamera();
                }
            }
*/

            var bb;
            if(label.bSchematic !== undefined && label.bSchematic) {

                bb = this.makeTextSprite(label.text, {fontsize: parseInt(labelsize), textColor: labelcolor, borderColor: labelbackground, backgroundColor: labelbackground, alpha: labelalpha, bSchematic: 1});
            }
            else {
                if(label.text.length === 1) {
                    bb = this.makeTextSprite(label.text, {fontsize: parseInt(labelsize), textColor: labelcolor, borderColor: labelbackground, backgroundColor: labelbackground, alpha: labelalpha, bSchematic: 1});
                }
                else {
                    bb = this.makeTextSprite(label.text, {fontsize: parseInt(labelsize), textColor: labelcolor, borderColor: labelbackground, backgroundColor: labelbackground, alpha: labelalpha, bSchematic: 0});
                }
            }

            bb.position.set(label.position.x, label.position.y, label.position.z);
            this.mdl.add(bb);
            // do not add labels to objects for pk
        }
    }

    // somehow the transformation is not stable when reset camera
//    this.maxD = tmpMaxD;
//    this.setCamera();
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3D.prototype.setAtmClr = function(atoms, hex) {
    for (var i in atoms) {
        var atom = this.atoms[i];
        atom.color = new THREE.Color().setHex(hex);

        this.atomPrevColors[i] = atom.color;
    }
};

iCn3D.prototype.updateChainsColor = function (atom) {
    var chainid = atom.structure + '_' + atom.chain;
    if(this.chainsColor[chainid] !== undefined) {  // for mmdbid and align input
        this.chainsColor[chainid] = atom.color;
    }
};

iCn3D.prototype.setMmdbChainColor = function (inAtoms) {
    var atoms = (inAtoms === undefined) ? this.hAtoms : inAtoms;
    this.applyOriginalColor(this.hash2Atoms(atoms));

    // atom color
    var atomHash = this.unionHash(this.chemicals, this.ions);

    for (var i in atomHash) {
        var atom = this.atoms[i];
        atom.color = this.atomColors[atom.elem] || this.defaultAtomColor;

        this.atomPrevColors[i] = atom.color;
    }
};

iCn3D.prototype.setConservationColor = function (atoms, bIdentity) {
/*
    for (var i in atoms) {
        var atom = this.atoms[i];
        atom.color = this.defaultAtomColor;

        this.atomPrevColors[i] = atom.color;
    }
*/
    this.setMmdbChainColor(atoms);

    for(var chainid in this.alnChainsSeq) {
        var resObjectArray = this.alnChainsSeq[chainid];

        for(var i = 0, il = resObjectArray.length; i < il; ++i) {
            var residueid = chainid + '_' + resObjectArray[i].resi;

            for(var j in this.residues[residueid]) {
                if(atoms.hasOwnProperty(j)) {
                    var color = (bIdentity) ? new THREE.Color(resObjectArray[i].color) : new THREE.Color(resObjectArray[i].color2);
                    this.atoms[j].color = color;
                    this.atomPrevColors[j] = color;
                }
            }
        }
    }
};

iCn3D.prototype.setColorByOptions = function (options, atoms, bUseInputColor) {
 if(options !== undefined) {
  if(bUseInputColor !== undefined && bUseInputColor) {
    for (var i in atoms) {
        var atom = this.atoms[i];

        this.atomPrevColors[i] = atom.color;
    }
  }
  else if(options.color.indexOf("#") === 0) {
    for (var i in atoms) {
        var atom = this.atoms[i];
        atom.color = new THREE.Color().setStyle(options.color.toLowerCase());

        this.atomPrevColors[i] = atom.color;
    }
  }
  else {
    switch (options.color.toLowerCase()) {
        case 'spectrum':
            var idx = 0;
            //var lastTerSerialInv = 1 / this.lastTerSerial;
            //var lastTerSerialInv = 1 / this.cnt;
            var cnt = 0;
            for (var i in atoms) {
                var atom = this.atoms[i];
                if(!atom.het) ++cnt;
            }

            var lastTerSerialInv = 1 / cnt;
            for (var i in atoms) {
                var atom = this.atoms[i];
                atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : new THREE.Color().setHSL(2 / 3 * (1 - idx++ * lastTerSerialInv), 1, 0.45);
                //atom.color = this.atomColors[atom.elem] || this.defaultAtomColor;

                this.atomPrevColors[i] = atom.color;
            }
            break;
        case 'chain':
            if(this.chainsColor !== undefined && Object.keys(this.chainsColor).length > 0) { // mmdb input
                this.setMmdbChainColor();
            }
            else {
                var index = -1, prevChain = '', colorLength = this.stdChainColors.length;
                for (var i in atoms) {
                    var atom = this.atoms[i];

                    if(atom.chain != prevChain) {
                        ++index;

                        index = index % colorLength;
                    }

                    atom.color = this.stdChainColors[index];

                    if(Object.keys(this.chainsColor).length > 0) this.updateChainsColor(atom);
                    this.atomPrevColors[i] = atom.color;

                    prevChain = atom.chain;
                }
            }
            break;
        case 'secondary structure':
            this.sheetcolor = 'green';
            for (var i in atoms) {
                var atom = this.atoms[i];
                // secondary color of nucleotide: blue (new THREE.Color(0x0000FF))
                atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : this.ssColors[atom.ss] || new THREE.Color(0xFF00FF);

                this.atomPrevColors[i] = atom.color;
            }

            break;

        case 'secondary structure yellow':
            this.sheetcolor = 'yellow';
            for (var i in atoms) {
                var atom = this.atoms[i];
                // secondary color of nucleotide: blue (new THREE.Color(0x0000FF))
                atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : this.ssColors2[atom.ss] || new THREE.Color(0xFF00FF);

                this.atomPrevColors[i] = atom.color;
            }

            break;

        case 'residue':
            for (var i in atoms) {
                var atom = this.atoms[i];
                atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : this.residueColors[atom.resn] || this.defaultResidueColor;

                this.atomPrevColors[i] = atom.color;
            }
            break;
        case 'charge':
            for (var i in atoms) {
                var atom = this.atoms[i];

                //atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : this.chargeColors[atom.resn] || this.defaultResidueColor;
                atom.color = atom.het ? this.defaultAtomColor : this.chargeColors[atom.resn] || this.defaultResidueColor;

                this.atomPrevColors[i] = atom.color;
            }
            break;
        case 'hydrophobic':
            for (var i in atoms) {
                var atom = this.atoms[i];

                //atom.color = atom.het ? this.atomColors[atom.elem] || this.defaultAtomColor : this.chargeColors[atom.resn] || this.defaultResidueColor;
                atom.color = atom.het ? this.defaultAtomColor : this.hydrophobicColors[atom.resn] || this.defaultResidueColor;

                this.atomPrevColors[i] = atom.color;
            }
            break;
        case 'atom':
            for (var i in atoms) {
                var atom = this.atoms[i];
                atom.color = this.atomColors[atom.elem] || this.defaultAtomColor;

                this.atomPrevColors[i] = atom.color;
            }
            break;

        case 'b factor':
/*
            //http://proteopedia.org/wiki/index.php/Disorder
            // < 30: blue; > 60: red; use 45 as the middle value
            if (!this.middB) {
                var minB = 1000, maxB = -1000;
                for (var i in this.atoms) {
                    var atom = this.atoms[i];
                    if (minB > atom.b) minB = atom.b;
                    if (maxB < atom.b) maxB = atom.b;
                }

                if(minB > 30) minB = 30;
                if(maxB < 60) maxB = 60;

                this.middB = 45; //(maxB + minB) * 0.5;
                this.spanBinv1 = (this.middB > minB) ? 1.0 / (this.middB - minB) : 0;
                this.spanBinv2 = (this.middB < maxB) ? 1.0 / (maxB - this.middB) : 0;
            }
*/

            // http://proteopedia.org/wiki/index.php/Temperature_color_schemes
            // Fixed: Middle (white): 50, red: >= 100, blue: 0
            this.middB = 50;
            this.spanBinv1 = 0.02;
            this.spanBinv2 = 0.02;

            for (var i in atoms) {
                var atom = this.atoms[i];
                if(atom.b === undefined || parseInt(atom.b * 1000) == 0) { // invalid b-factor
                    atom.color =  new THREE.Color().setRGB(0, 1, 0);
                }
                else {
                    var b = atom.b;
                    if(b > 100) b = 100;

                    atom.color = b < this.middB ? new THREE.Color().setRGB(1 - (s = (this.middB - b) * this.spanBinv1), 1 - s, 1) : new THREE.Color().setRGB(1, 1 - (s = (b - this.middB) * this.spanBinv2), 1 - s);
                }

                this.atomPrevColors[i] = atom.color;
            }
            break;

        case 'b factor percentile':
            //http://proteopedia.org/wiki/index.php/Disorder
            // percentile normalize B-factor values from 0 to 1
            var minB = 1000, maxB = -1000;
            if (!this.bfactorArray) {
                this.bfactorArray = [];
                for (var i in this.atoms) {
                    var atom = this.atoms[i];
                    if (minB > atom.b) minB = atom.b;
                    if (maxB < atom.b) maxB = atom.b;

                    this.bfactorArray.push(atom.b);
                }

                this.bfactorArray.sort(function(a, b) { return a - b; });
            }

            var totalCnt = this.bfactorArray.length;
            for (var i in atoms) {
                var atom = this.atoms[i];
                if(atom.b === undefined || parseInt(atom.b * 1000) == 0 || this.bfactorArray.length == 0) { // invalid b-factor
                    atom.color =  new THREE.Color().setRGB(0, 1, 0);
                }
                else {
                    var percentile = this.bfactorArray.indexOf(atom.b) / totalCnt;

                    atom.color = percentile < 0.5 ? new THREE.Color().setRGB(percentile * 2, percentile * 2, 1) : new THREE.Color().setRGB(1, (1 - percentile) * 2, (1 - percentile) * 2);
                }

                this.atomPrevColors[i] = atom.color;
            }

            break;

        case 'identity':
            this.setConservationColor(atoms, true);
            break;

        case 'conserved': // backward-compatible, "conserved" was changed to "identity"
            this.setConservationColor(atoms, true);
            break;

        case 'conservation':
            this.setConservationColor(atoms, false);
            break;

        case 'white':
            this.setAtmClr(atoms, 0xFFFFFF);
            break;

        case 'grey':
            this.setAtmClr(atoms, 0x888888);
            break;

        case 'red':
            this.setAtmClr(atoms, 0xFF0000);
            break;
        case 'green':
            this.setAtmClr(atoms, 0x00FF00);
            break;
        case 'blue':
            this.setAtmClr(atoms, 0x0000FF);
            break;
        case 'magenta':
            this.setAtmClr(atoms, 0xFF00FF);
            break;
        case 'yellow':
            this.setAtmClr(atoms, 0xFFFF00);
            break;
        case 'cyan':
            this.setAtmClr(atoms, 0x00FFFF);
            break;
        case 'custom':
            // do the coloring separately
            break;

        default: // the "#" was missed in order to make sharelink work
            for (var i in atoms) {
                var atom = this.atoms[i];
                atom.color = new THREE.Color().setStyle("#" + options.color.toLowerCase());

                this.atomPrevColors[i] = atom.color;
            }

            break;
    }
  }
 }
};

iCn3D.prototype.applyDisplayOptions = function (options, atoms, bHighlight) { var me = this; // atoms: hash of key -> 1
    if(options === undefined) options = this.opts;

    var residueHash = {};
    var singletonResidueHash = {};
    var atomsObj = {};
    var residueid;

    if(bHighlight === 1 && Object.keys(atoms).length < Object.keys(this.atoms).length) {
        atomsObj = this.hash2Atoms(atoms);

        //for(var i in atomsObj) {
        //    var atom = atomsObj[i];

        //    residueid = atom.structure + '_' + atom.chain + '_' + atom.resi;
        //    residueHash[residueid] = 1;
        //}

        residueHash = me.getResiduesFromAtoms(atoms);

        // find singleton residues
        for(var i in residueHash) {
            residueid = i;

            var last = i.lastIndexOf('_');
            var base = i.substr(0, last + 1);
            var lastResi = parseInt(i.substr(last + 1));

            var prevResidueid = base + (lastResi - 1).toString();
            var nextResidueid = base + (lastResi + 1).toString();

            if(!residueHash.hasOwnProperty(prevResidueid) && !residueHash.hasOwnProperty(prevResidueid)) {
                singletonResidueHash[i] = 1;
            }
        }

        // show the only atom in a transparent box
        if(Object.keys(atomsObj).length === 1 && Object.keys(this.residues[residueid]).length > 1
              && atomsObj[Object.keys(atomsObj)[0]].style !== 'sphere' && atomsObj[Object.keys(atomsObj)[0]].style !== 'dot') {
            if(this.bCid === undefined || !this.bCid) {
                for(var i in atomsObj) {
                    var atom = atomsObj[i];
                    var scale = 1.0;
                    this.createBox(atom, undefined, undefined, scale, undefined, bHighlight);
                }
            }
        }
        else {
            // if only one residue, add the next residue in order to show highlight
            for(var residueid in singletonResidueHash) {
                //var atom = this.getFirstAtomObj(this.residues[residueid]);
                // get calpha
                var calpha = this.getFirstCalphaAtomObj(this.residues[residueid]);
                var atom = calpha;

                var prevResidueid = atom.structure + '_' + atom.chain + '_' + parseInt(atom.resi - 1);
                var nextResidueid = atom.structure + '_' + atom.chain + '_' + parseInt(atom.resi + 1);

                //ribbon, strand, cylinder and plate, nucleotide cartoon, o3 trace, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, dot

                if(atom.style === 'cylinder and plate' && atom.ss === 'helix') { // no way to highlight part of cylinder
                    for(var i in this.residues[residueid]) {
                        var atom = this.atoms[i];
                        var scale = 1.0;
                        this.createBox(atom, undefined, undefined, scale, undefined, bHighlight);
                    }
                }
                else if( (atom.style === 'ribbon' && atom.ss === 'coil') || (atom.style === 'strand' && atom.ss === 'coil') || atom.style === 'o3 trace' || atom.style === 'schematic' || atom.style === 'c alpha trace' || atom.style === 'b factor tube' || (atom.style === 'cylinder and plate' && atom.ss !== 'helix') ) {
                    // do not add extra residue if the side chain is shown
                    if(calpha !== undefined && calpha.style2 !== undefined && calpha.style2 !== 'nothing') continue;

                    var bAddResidue = false;
                    // add the next residue with same style
                    if(!bAddResidue && this.residues.hasOwnProperty(nextResidueid)) {
                        var index2 = Object.keys(this.residues[nextResidueid])[0];
                        var atom2 = this.hash2Atoms(this.residues[nextResidueid])[index2];
                        if( (atom.style === atom2.style && !atom2.ssbegin) || atom2.ssbegin) {
                            var residueAtoms = this.residues[nextResidueid];
                            atoms = this.unionHash(atoms, residueAtoms);

                            bAddResidue = true;

                            // record the highlight style for the artificial residue
                            if(atom2.ssbegin) {
                                for(var i in residueAtoms) {
                                    this.atoms[i].notshow = true;
                                }
                            }
                        }
                    }

                    // add the previous residue with same style
                    if(!bAddResidue && this.residues.hasOwnProperty(prevResidueid)) {
                        var index2 = Object.keys(this.residues[prevResidueid])[0];
                        var atom2 = this.hash2Atoms(this.residues[prevResidueid])[index2];
                        if(atom.style === atom2.style) {
                            atoms = this.unionHash(atoms, this.residues[prevResidueid]);

                            bAddResidue = true;
                        }
                    }
                }
                else if( (atom.style === 'ribbon' && atom.ss !== 'coil' && atom.ssend) || (atom.style === 'strand' && atom.ss !== 'coil' && atom.ssend)) {
                    // do not add extra residue if the side chain is shown
                    if(calpha !== undefined && calpha.style2 !== undefined && calpha.style2 !== 'nothing') continue;

                    var bAddResidue = false;
                    // add the next residue with same style
                    if(!bAddResidue && this.residues.hasOwnProperty(nextResidueid)) {
                        var index2 = Object.keys(this.residues[nextResidueid])[0];
                        var atom2 = this.hash2Atoms(this.residues[nextResidueid])[index2];
                        //if(atom.style === atom2.style && !atom2.ssbegin) {
                            atoms = this.unionHash(atoms, this.residues[nextResidueid]);

                            bAddResidue = true;
                        //}
                    }
                }
            } // end for
        } // end else {

        atomsObj = {};
    } // end if(bHighlight === 1)

    this.setStyle2Atoms(atoms);

    //this.bAllAtoms = (Object.keys(atoms).length === Object.keys(this.atoms).length);
    this.bAllAtoms = false;
    if(atoms && atoms !== undefined ) {
        this.bAllAtoms = (Object.keys(atoms).length === Object.keys(this.atoms).length);
    }

//        var currentCalphas = {};
//        if(this.opts['sidec'] !== 'nothing') {
//            currentCalphas = this.intHash(this.hAtoms, this.calphas);
//        }

    var chemicalSchematicRadius = this.cylinderRadius * 0.5;

    // remove schematic labels
    //if(this.labels !== undefined) this.labels['schematic'] = undefined;
    if(this.labels !== undefined) delete this.labels['schematic'];

    var bOnlySideChains = false;

    if(bHighlight) {
        var residueHashCalpha = this.getResiduesFromCalphaAtoms(this.hAtoms);

        var proteinAtoms = this.intHash(this.hAtoms, this.proteins);
        var residueHash = this.getResiduesFromAtoms(proteinAtoms);

        if(Object.keys(residueHash) > Object.keys(residueHashCalpha)) { // some residues have only side chains
            bOnlySideChains = true;
        }

/*
        bOnlySideChains = true;

        for(var i in this.hAtoms) {
            if(this.atoms[i].name == 'CA') {
                bOnlySideChains = false;
                break;
            }
        }
*/
    }

    for(var style in this.style2atoms) {
      // 14 styles: ribbon, strand, cylinder and plate, nucleotide cartoon, o3 trace, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, dot, nothing
      var atomHash = this.style2atoms[style];
      //var bPhosphorusOnly = this.isCalphaPhosOnly(this.hash2Atoms(atomHash), "O3'", "O3*") || this.isCalphaPhosOnly(this.hash2Atoms(atomHash), "P");
      var bPhosphorusOnly = this.isCalphaPhosOnly(this.hash2Atoms(atomHash));

      //if(style === 'ribbon') {
      if(style === 'ribbon' && (!bHighlight || (bHighlight && !bOnlySideChains))) {
          this.createStrand(this.hash2Atoms(atomHash), 2, undefined, true, undefined, undefined, false, this.ribbonthickness, bHighlight);
      }
      //else if(style === 'strand') {
      else if(style === 'strand' && (!bHighlight || (bHighlight && !bOnlySideChains))) {
          this.createStrand(this.hash2Atoms(atomHash), null, null, null, null, null, false, undefined, bHighlight);
      }
      //else if(style === 'cylinder and plate') {
      else if(style === 'cylinder and plate' && (!bHighlight || (bHighlight && !bOnlySideChains))) {
        this.createCylinderHelix(this.hash2Atoms(atomHash), this.cylinderHelixRadius, bHighlight);
      }
      else if(style === 'nucleotide cartoon') {
        if(bPhosphorusOnly) {
            this.createCylinderCurve(this.hash2Atoms(atomHash), ["P"], this.traceRadius, false, bHighlight);
        }
        else {
            this.drawCartoonNucleicAcid(this.hash2Atoms(atomHash), null, this.ribbonthickness, bHighlight);

            if(bHighlight !== 2) this.drawNucleicAcidStick(this.hash2Atoms(atomHash), bHighlight);
        }
      }
      else if(style === 'o3 trace') {
        if(bPhosphorusOnly) {
            this.createCylinderCurve(this.hash2Atoms(atomHash), ["P"], this.traceRadius, false, bHighlight);
        }
        else {
            this.createCylinderCurve(this.hash2Atoms(atomHash), ["O3'", "O3*"], this.traceRadius, false, bHighlight);
        }
      }
      //else if(style === 'phosphorus lines') {
      //  this.createCylinderCurve(this.hash2Atoms(atomHash), ["O3'", "O3*"], 0.2, true, bHighlight);
      //}
      else if(style === 'schematic') {
        // either proteins, nucleotides, or chemicals
        var firstAtom = this.getFirstAtomObj(atomHash);

        //if(firstAtom.het) { // chemicals
        if(this.chemicals.hasOwnProperty(firstAtom.serial)) { // chemicals
            this.addNonCarbonAtomLabels(this.hash2Atoms(atomHash));

            bSchematic = true;
            this.createStickRepresentation(this.hash2Atoms(atomHash), chemicalSchematicRadius, chemicalSchematicRadius, undefined, bHighlight, bSchematic);
        }
        else { // nucleotides or proteins
            this.addResiudeLabels(this.hash2Atoms(atomHash), true);

            if(bPhosphorusOnly) {
                this.createCylinderCurve(this.hash2Atoms(atomHash), ["P"], this.traceRadius, false, bHighlight);
            }
            else {
                this.createCylinderCurve(this.hash2Atoms(atomHash), ["O3'", "O3*"], this.traceRadius, false, bHighlight);
            }
            this.createCylinderCurve(this.hash2Atoms(atomHash), ['CA'], this.traceRadius, false, bHighlight);
        }
      }
      else if(style === 'c alpha trace') {
        this.createCylinderCurve(this.hash2Atoms(atomHash), ['CA'], this.traceRadius, false, bHighlight);
      }
      else if(style === 'b factor tube') {
        this.createTube(this.hash2Atoms(atomHash), 'CA', null, bHighlight);
      }
      else if(style === 'lines') {
        if(bHighlight === 1) {
            this.createStickRepresentation(this.hash2Atoms(atomHash), this.hlLineRadius, this.hlLineRadius, undefined, bHighlight);
        }
        else {
            this.createLineRepresentation(this.hash2Atoms(atomHash), bHighlight);
        }
      }
      else if(style === 'stick') {
        this.createStickRepresentation(this.hash2Atoms(atomHash), this.cylinderRadius, this.cylinderRadius, undefined, bHighlight);
      }
      else if(style === 'ball and stick') {
        this.createStickRepresentation(this.hash2Atoms(atomHash), this.cylinderRadius, this.cylinderRadius * 0.5, this.dotSphereScale, bHighlight);
      }
      else if(style === 'sphere') {
        this.createSphereRepresentation(this.hash2Atoms(atomHash), this.sphereRadius, undefined, undefined, bHighlight);
      }
      else if(style === 'dot') {
        this.createSphereRepresentation(this.hash2Atoms(atomHash), this.sphereRadius, false, this.dotSphereScale, bHighlight);
      }
    } // end for loop

    if(this.cnt > this.maxmaxatomcnt) { // release memory
        this.init_base();
    }

    // hide the previous labels
    if(this.labels !== undefined && Object.keys(this.labels).length > 0) {
        this.hideLabels();

        // labels
        this.createLabelRepresentation(this.labels);
    }
};

iCn3D.prototype.hideLabels = function () { var me = this;
    // remove previous labels
    if(this.mdl !== undefined) {
        for(var i = 0, il = this.mdl.children.length; i < il; ++i) {
             var mesh = this.mdl.children[i];
             if(mesh !== undefined && mesh.type === 'Sprite') {
                 this.mdl.remove(mesh); // somehow didn't work
             }
        }
    }
};

iCn3D.prototype.setStyle2Atoms = function (atoms) {
      this.style2atoms = {};

      for(var i in atoms) {
        // do not show water in assemly
        //if(this.bAssembly && this.water.hasOwnProperty(i)) {
        //    this.atoms[i].style = 'nothing';
        //}

        if(this.style2atoms[this.atoms[i].style] === undefined) this.style2atoms[this.atoms[i].style] = {};

        this.style2atoms[this.atoms[i].style][i] = 1;

        // side chains
        if(this.atoms[i].style2 !== undefined && this.atoms[i].style2 !== 'nothing') {
            if(this.style2atoms[this.atoms[i].style2] === undefined) this.style2atoms[this.atoms[i].style2] = {};

            this.style2atoms[this.atoms[i].style2][i] = 1;
        }
      }

/*
      for(var i in this.atoms) {
          if(atoms.hasOwnProperty(i)) {
            if(this.style2atoms[this.atoms[i].style] === undefined) this.style2atoms[this.atoms[i].style] = {};

            this.style2atoms[this.atoms[i].style][i] = 1;

            // side chains
            if(this.style2atoms[this.atoms[i].style2] === undefined) this.style2atoms[this.atoms[i].style2] = {};

            this.style2atoms[this.atoms[i].style2][i] = 1;
          }
          else if(this.atoms[i].style == 'schematic') { // always display schematic
            if(this.style2atoms[this.atoms[i].style] === undefined) this.style2atoms[this.atoms[i].style] = {};
            this.style2atoms[this.atoms[i].style][i] = 1;
          }
      }
*/
};

// set atom style when loading a structure
iCn3D.prototype.setAtomStyleByOptions = function (options) {
    if(options === undefined) options = this.opts;

    var selectedAtoms;

    if (options.proteins !== undefined) {
        selectedAtoms = this.intHash(this.hAtoms, this.proteins);
        for(var i in selectedAtoms) {
          this.atoms[i].style = options.proteins.toLowerCase();
        }
    }

    // side chain use style2
    if (options.sidec !== undefined && options.sidec !== 'nothing') {
        selectedAtoms = this.intHash(this.hAtoms, this.sidec);
        //var sidec_calpha = this.unionHash(this.calphas, this.sidec);
        //selectedAtoms = this.intHash(this.hAtoms, sidec_calpha);

        for(var i in selectedAtoms) {
          this.atoms[i].style2 = options.sidec.toLowerCase();
        }
    }

    if (options.chemicals !== undefined) {
        selectedAtoms = this.intHash(this.hAtoms, this.chemicals);
        for(var i in selectedAtoms) {
          this.atoms[i].style = options.chemicals.toLowerCase();
        }
    }

    if (options.ions !== undefined) {
        selectedAtoms = this.intHash(this.hAtoms, this.ions);
        for(var i in selectedAtoms) {
          this.atoms[i].style = options.ions.toLowerCase();
        }
    }

    if (options.water !== undefined) {
        selectedAtoms = this.intHash(this.hAtoms, this.water);
        for(var i in selectedAtoms) {
          this.atoms[i].style = options.water.toLowerCase();
        }
    }

    if (options.nucleotides !== undefined) {
        selectedAtoms = this.intHash(this.hAtoms, this.nucleotides);
        for(var i in selectedAtoms) {
          this.atoms[i].style = options.nucleotides.toLowerCase();
        }
    }
};

iCn3D.prototype.rebuildSceneBase = function (options) { var me = this;
    jQuery.extend(me.opts, options);

    this.cam_z = this.maxD * 2;
    //this.cam_z = -this.maxD * 2;

    if(this.scene !== undefined) {
        for(var i = this.scene.children.length - 1; i >= 0; i--) {
             var obj = this.scene.children[i];
             this.scene.remove(obj);
        }
    }
    else {
        this.scene = new THREE.Scene();
    }

    if(this.scene_ghost !== undefined) {
        for(var i = this.scene_ghost.children.length - 1; i >= 0; i--) {
             var obj = this.scene_ghost.children[i];
             this.scene_ghost.remove(obj);
        }
    }
    else {
        this.scene_ghost = new THREE.Scene();
    }

    //this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);

    if(this.cam_z > 0) {
      this.directionalLight.position.set(0, 0, 1);
    }
    else {
      this.directionalLight.position.set(0, 0, -1);
    }

    //var ambientLight = new THREE.AmbientLight(0x202020);
    //var ambientLight = new THREE.AmbientLight(0xdddddd, 0.2);
    var ambientLight = new THREE.AmbientLight(0x404040);

    this.scene.add(this.directionalLight);
    this.scene.add(ambientLight);

    //this.group = new THREE.Object3D();  // regular display

    this.mdl = new THREE.Object3D();  // regular display
    //this.mdlPicking = new THREE.Object3D();  // pk display
    this.mdlImpostor = new THREE.Object3D();  // Impostor display

    //this.scene.add(this.mdlPicking);
    this.scene.add(this.mdl);
    this.scene.add(this.mdlImpostor);

    // highlight on impostors
    this.mdl_ghost = new THREE.Object3D();  // Impostor display
    this.scene_ghost.add(this.mdl_ghost);

    //this.scene_ghost.add(this.directionalLight);
    //this.scene_ghost.add(ambientLight);

    // related to pk
    this.objects = []; // define objects for pk, not all elements are used for pk
    this.objects_ghost = []; // define objects for pk, not all elements are used for pk
    this.raycaster = new THREE.Raycaster();
    this.projector = new THREE.Projector();
    this.mouse = new THREE.Vector2();

    var background = this.backgroundColors[this.opts.background.toLowerCase()];

    if(this.opts.background.toLowerCase() === 'transparent') {
        this.renderer.setClearColor(background, 0);
    }
    else {
        this.renderer.setClearColor(background, 1);
    }

    this.perspectiveCamera = new THREE.PerspectiveCamera(20, this.container.whratio, 0.1, 10000);
    this.perspectiveCamera.position.set(0, 0, this.cam_z);
    this.perspectiveCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.orthographicCamera = new THREE.OrthographicCamera();
    this.orthographicCamera.position.set(0, 0, this.cam_z);
    this.orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0));

    this.cams = {
        perspective: this.perspectiveCamera,
        orthographic: this.orthographicCamera,
    };
};

iCn3D.prototype.setCamera = function() {
    this.cam = this.cams[this.opts.camera.toLowerCase()];

    if(this.cam === this.perspectiveCamera) {
        var factor = (this.biomtMatrices !== undefined && this.biomtMatrices.length * this.cnt > 10 * this.maxatomcnt) ? 1 : 2;
        if(this.cam_z > 0) {
          this.cam.position.z = this.maxD * factor; // forperspective, the z positionshould be large enough to see the whole molecule
        }
        else {
          this.cam.position.z = -this.maxD * factor; // forperspective, the z positionshould be large enough to see the whole molecule
        }

        if(this.opts['slab'] === 'yes') {
            this.cam.near = this.maxD * 2;
        }
        else {
            this.cam.near = 0.1;
        }
        this.cam.far = 10000;

        this.controls = new THREE.TrackballControls( this.cam, document.getElementById(this.id), this );
    }
    else if (this.cam === this.orthographicCamera){
        if(this.biomtMatrices !== undefined && this.biomtMatrices.length * this.cnt > 10 * this.maxatomcnt) {
            this.cam.right = this.maxD/2 * 1.5;
        }
        else {
            this.cam.right = this.maxD/2 * 2.5;
        }

        this.cam.left = -this.cam.right;
        this.cam.top = this.cam.right /this.container.whratio;
        this.cam.bottom = -this.cam.right /this.container.whratio;

          if(this.opts['slab'] === 'yes') {
              this.cam.near = this.maxD * 2;
          }
          else {
            this.cam.near = 0;
          }

          this.cam.far = 10000;

        this.controls = new THREE.OrthographicTrackballControls( this.cam, document.getElementById(this.id), this );
    }

    this.cam.updateProjectionMatrix();
};

iCn3D.prototype.render = function () {
    this.directionalLight.position.copy(this.cam.position);

    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

    this.renderer.setPixelRatio( window.devicePixelRatio ); // r71
    this.renderer.render(this.scene, this.cam);
    //this.renderer.render(this.scene_ghost, this.cam);
};

iCn3D.prototype.clearImpostors = function () {
    this.posArray = [];
    this.colorArray = [];
    this.pos2Array = [];
    this.color2Array = [];
    this.radiusArray = [];

    this.posArraySphere = [];
    this.colorArraySphere = [];
    this.radiusArraySphere = [];
};

iCn3D.prototype.applyTransformation = function (_zoomFactor, mouseChange, quaternion) {
    var para = {};
    para.update = false;

    // zoom
    para._zoomFactor = _zoomFactor;

    // translate
    para.mouseChange = new THREE.Vector2();
    para.mouseChange.copy(mouseChange);

    // rotation
    para.quaternion = new THREE.Quaternion();
    para.quaternion.copy(quaternion);

    this.controls.update(para);
};

iCn3D.prototype.applyCenterOptions = function (options) {
    if(options === undefined) options = this.opts;

    switch (options.rotationcenter.toLowerCase()) {
        case 'molecule center':
            // move the molecule to the origin
            if(this.center !== undefined) {
                this.setRotationCenter(this.center);
            }
            break;
        case 'pick center':
            if(this.pAtom !== undefined) {
              this.setRotationCenter(this.pAtom.coord);
            }
            break;
        case 'display center':
            var center = this.centerAtoms(this.dAtoms).center;
            this.setRotationCenter(center);
            break;
        case 'highlight center':
            var center = this.centerAtoms(this.hAtoms).center;
            this.setRotationCenter(center);
            break;
    }
};

iCn3D.prototype.setRotationCenter = function (coord) {
   this.mdl.position.set(0,0,0);
   this.mdlImpostor.position.set(0,0,0);
   this.mdl_ghost.position.set(0,0,0);

    //this.mdlPicking.position.sub(coord);
    this.mdl.position.sub(coord);
    this.mdlImpostor.position.sub(coord);
    this.mdl_ghost.position.sub(coord);
};

iCn3D.prototype.applyOriginalColor = function (atoms) {
    if(atoms === undefined) atoms = this.atoms;

    for (var i in atoms) {
        var atom = atoms[i];
        var chainid = atom.structure + '_' + atom.chain;

        if(this.chainsColor.hasOwnProperty(chainid)) {
            atom.color = this.chainsColor[chainid];
        }
        else {
            atom.color = this.atomColors[atom.elem];
            //break;
        }

        this.atomPrevColors[i] = atom.color;
    }
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3D.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material) {
  var u = material.uniforms;
  var updateList = [];

  if (u.objectId) {
    u.objectId.value = SupportsReadPixelsFloat ? this.id : this.id / 255
    updateList.push('objectId')
  }

  if (u.modelViewMatrixInverse || u.modelViewMatrixInverseTranspose ||
      u.modelViewProjectionMatrix || u.modelViewProjectionMatrixInverse
  ) {
    this.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, this.matrixWorld);
  }

  if (u.modelViewMatrixInverse) {
    u.modelViewMatrixInverse.value.getInverse(this.modelViewMatrix);
    updateList.push('modelViewMatrixInverse');
  }

  if (u.modelViewMatrixInverseTranspose) {
    if (u.modelViewMatrixInverse) {
      u.modelViewMatrixInverseTranspose.value.copy(
        u.modelViewMatrixInverse.value
      ).transpose();
    } else {
      u.modelViewMatrixInverseTranspose.value
        .getInverse(this.modelViewMatrix)
        .transpose();
    }
    updateList.push('modelViewMatrixInverseTranspose');
  }

  if (u.modelViewProjectionMatrix) {
    camera.updateProjectionMatrix();
    u.modelViewProjectionMatrix.value.multiplyMatrices(
      camera.projectionMatrix, this.modelViewMatrix
    );
    updateList.push('modelViewProjectionMatrix');
  }

  if (u.modelViewProjectionMatrixInverse) {
    var tmpMatrix = new THREE.Matrix4();
    if (u.modelViewProjectionMatrix) {
      tmpMatrix.copy(
        u.modelViewProjectionMatrix.value
      );
      u.modelViewProjectionMatrixInverse.value.getInverse(
        tmpMatrix
      );
    } else {
      camera.updateProjectionMatrix();
      tmpMatrix.multiplyMatrices(
        camera.projectionMatrix, this.modelViewMatrix
      );
      u.modelViewProjectionMatrixInverse.value.getInverse(
        tmpMatrix
      );
    }
    updateList.push('modelViewProjectionMatrixInverse');
  }

  if (u.projectionMatrix) {
    camera.updateProjectionMatrix();
    u.projectionMatrix.value.copy( camera.projectionMatrix );
    updateList.push('projectionMatrix');
  }

  if (u.projectionMatrixInverse) {
    camera.updateProjectionMatrix();
    u.projectionMatrixInverse.value.getInverse(camera.projectionMatrix);
    updateList.push('projectionMatrixInverse');
  }

  if (updateList.length) {
    var materialProperties = renderer.properties.get(material);

    if (materialProperties.program) {
      var gl = renderer.getContext();
      var p = materialProperties.program;
      gl.useProgram(p.program);
      var pu = p.getUniforms();

      updateList.forEach(function (name) {
        pu.setValue(gl, name, u[ name ].value)
      });
    }
  }
};

iCn3D.prototype.setParametersForShader = function (opacity) { var me = this;
/*
    var modelViewMatrix = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function( object ){
                this.value.copy( object.modelViewMatrix );
    } );

    var modelViewMatrixInverse = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function( object ){
                this.value.getInverse( object.modelViewMatrix );
    } );

    var modelViewMatrixInverseTranspose = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function( object ){
                this.value.getInverse( object.modelViewMatrix ).transpose();
    } );

    var modelViewProjectionMatrix = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function( object ){
                this.value.multiplyMatrices( me.cam.projectionMatrix, object.modelViewMatrix );
    } );

    var modelViewProjectionMatrixInverse = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function( object ){
                var tmpMatrix = new THREE.Matrix4();
                tmpMatrix.multiplyMatrices(me.cam.projectionMatrix, object.modelViewMatrix);
                this.value.getInverse(tmpMatrix);
    } );

    var projectionMatrix = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function(  ){
                this.value.copy( me.cam.projectionMatrix );
    } );

    var projectionMatrixInverse = new THREE.Uniform( new THREE.Matrix4() )
            .onUpdate( function(  ){
                this.value.getInverse( me.cam.projectionMatrix );
    } );
*/

    var background = this.backgroundColors[this.opts.background.toLowerCase()];
    //var near = 2 * this.maxD;
    var near = 1.5 * this.maxD;
    //var far = 2.5 * this.maxD;
    var far = 3 * this.maxD;

    var opacityValue = (opacity !== undefined) ? opacity : 1.0;

    this.uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.common,
      {
/*
        modelViewMatrix: modelViewMatrix,
        modelViewMatrixInverse: modelViewMatrixInverse,
        modelViewMatrixInverseTranspose: modelViewMatrixInverseTranspose,
        modelViewProjectionMatrix: modelViewProjectionMatrix,
        modelViewProjectionMatrixInverse: modelViewProjectionMatrixInverse,
        projectionMatrix: projectionMatrix,
        projectionMatrixInverse: projectionMatrixInverse,
*/

        modelViewMatrix: { value: new THREE.Matrix4() },
        modelViewMatrixInverse: { value: new THREE.Matrix4() },
        modelViewMatrixInverseTranspose: { value: new THREE.Matrix4() },
        modelViewProjectionMatrix: { value: new THREE.Matrix4() },
        modelViewProjectionMatrixInverse: { value: new THREE.Matrix4() },
        projectionMatrix: { value: new THREE.Matrix4() },
        projectionMatrixInverse: { value: new THREE.Matrix4() },

        //ambientLightColor: { type: "v3", value: [0.25, 0.25, 0.25] },
        diffuse: { type: "v3", value: [1.0, 1.0, 1.0] },
        emissive: { type: "v3", value: [0.0,0.0,0.0] },
        roughness: { type: "f", value: 0.5 }, // 0.4
        metalness: { type: "f", value: 0.3 }, // 0.5
        opacity: { type: "f", value: opacityValue },
        nearClip: { type: "f", value: 0.1 },
        ortho: { type: "f", value: 0.0 },
        shrink: { type: "f", value: 0.13 },
        fogColor: { type: "v3", value: [background.r, background.g, background.b] },
        fogNear: { type: "f", value: near },
        fogFar: { type: "f", value: far },
        fogDensity: { type: "f", value: 2.0 }
      },
        THREE.UniformsLib.ambient,
        THREE.UniformsLib.lights
    ]);

    /*
    //fog_pars_fragment
    #ifdef USE_FOG
        uniform vec3 fogColor;
        #ifdef FOG_EXP2
            uniform float fogDensity;
        #else
            uniform float fogNear;
            uniform float fogFar;
        #endif
    #endif
    */

    this.defines = {
        USE_COLOR: 1,
        //PICKING: 1,
        NEAR_CLIP: 1,
        CAP: 1
    };

    if(this.opts['fog'] === 'yes') {
        this.defines['USE_FOG'] = 1;
        if(this.opts['camera'] === 'orthographic') {
            this.defines['FOG_EXP2'] = 1;
        }
    }

    if(this.bExtFragDepth) {
        this.defines['USE_LOGDEPTHBUF_EXT'] = 1;
    }
};

iCn3D.prototype.drawImpostorShader = function () { var me = this;
    this.setParametersForShader();

    this.createImpostorShaderSphere("SphereImpostor");
    this.createImpostorShaderCylinder("CylinderImpostor");
    //this.createImpostorShaderCylinder("HyperballStickImpostor");
};

iCn3D.prototype.getShader = function (name) { var me = this;
  var shaderText = $NGL_shaderTextHash[name];
  var reInclude = /#include\s+(\S+)/gmi;

  shaderText = shaderText.replace( reInclude, function( match, p1 ){

        var chunk;
        if(THREE.ShaderChunk.hasOwnProperty(p1)) {
            chunk = THREE.ShaderChunk[ p1 ];
        }

        return chunk ? chunk : "";

  } );

  return shaderText;
};

iCn3D.prototype.createImpostorShaderBase = function (shaderName, mapping, mappingIndices, data, attributeData, count, mappingSize, mappingIndicesSize, mappingItemSize) { var me = this;
  var shaderMaterial =
    new THREE.ShaderMaterial({
      defines: me.defines,
      uniforms:  me.uniforms,
      vertexShader:   me.getShader(shaderName + ".vert"),
      fragmentShader: me.getShader(shaderName + ".frag"),
      depthTest: true,
      depthWrite: true,
      needsUpdate: true,
      lights: true
  });

  shaderMaterial.extensions.fragDepth = true;

  if(shaderName == 'CylinderImpostor') {
      this.CylinderImpostorMaterial = shaderMaterial;
  }
  else if(shaderName == 'SphereImpostor') {
      this.SphereImpostorMaterial = shaderMaterial;
  }

    //MappedBuffer
    var attributeSize = count * mappingSize;

    var n = count * mappingIndicesSize;
    var TypedArray = attributeSize > 65535 ? Uint32Array : Uint16Array;
    var index = new TypedArray( n );

        //makeIndex();
    var ix, it;

    for( var v = 0; v < count; v++ ) {
        ix = v * mappingIndicesSize;
        it = v * mappingSize;

        index.set( mappingIndices, ix );

        for( var s = 0; s < mappingIndicesSize; ++s ){
            index[ ix + s ] += it;
        }
    }


    var geometry = new THREE.BufferGeometry();

    // buffer.js
    var dynamic = true;

    if( index ){
        geometry.setIndex(
            new THREE.BufferAttribute( index, 1 )
        );
        geometry.getIndex().setDynamic( dynamic );
    }

    // add attributes from buffer.js
    var itemSize = {
        "f": 1, "v2": 2, "v3": 3, "c": 3
    };

    for( var name in attributeData ){

        var buf;
        var a = attributeData[ name ];

            buf = new Float32Array(
                attributeSize * itemSize[ a.type ]
            );

        geometry.addAttribute(
            name,
            new THREE.BufferAttribute( buf, itemSize[ a.type ] )
                .setDynamic( dynamic )
        );

    }

    // set attributes from mapped-buffer.js
    var attributes = geometry.attributes;

    var a, d, itemSize2, array, i, j;

    for( var name in data ){

        d = data[ name ];
        a = attributes[ name ];
        itemSize2 = a.itemSize;
        array = a.array;

        for( var k = 0; k < count; ++k ) {

            n = k * itemSize2;
            i = n * mappingSize;

            for( var l = 0; l < mappingSize; ++l ) {

                j = i + ( itemSize2 * l );

                for( var m = 0; m < itemSize2; ++m ) {

                    array[ j + m ] = d[ n + m ];

                }

            }

        }

        a.needsUpdate = true;

    }

    // makemapping
    var aMapping = geometry.attributes.mapping.array;

    for( var v = 0; v < count; v++ ) {
        aMapping.set( mapping, v * mappingItemSize * mappingSize );
    }

    var mesh = new THREE.Mesh(geometry, shaderMaterial);

    // important: https://stackoverflow.com/questions/21184061/mesh-suddenly-disappears-in-three-js-clipping
    // You are moving the camera in the CPU. You are moving the vertices of the plane in the GPU
    mesh.frustumCulled = false;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.0;

    if(shaderName == 'CylinderImpostor') {
      mesh.type = 'Cylinder';
    }
    else if(shaderName == 'SphereImpostor') {
      mesh.type = 'Sphere';
    }

    //mesh.onBeforeRender = this.onBeforeRender(this.renderer, this.scene, this.cam, geometry, shaderMaterial);
    mesh.onBeforeRender = this.onBeforeRender;

    this.mdlImpostor.add(mesh);

    //this.objects.push(mesh);
};

iCn3D.prototype.createImpostorShaderCylinder = function (shaderName) { var me = this;
    var positions = new Float32Array( me.posArray );
    var colors = new Float32Array( me.colorArray );
    var positions2 = new Float32Array( me.pos2Array );
    var colors2 = new Float32Array( me.color2Array );
    var radii = new Float32Array( me.radiusArray );

    // cylinder
    var mapping = new Float32Array([
        -1.0,  1.0, -1.0,
        -1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0
    ]);

    var mappingIndices = new Uint16Array([
        0, 1, 2,
        1, 4, 2,
        2, 4, 3,
        4, 5, 3
    ]);

    var mappingIndicesSize = 12;
    var mappingType = "v3";
    var mappingSize = 6;
    var mappingItemSize = 3;


    var count = positions.length / 3;

    var data = {
        "position1": positions,
        "color": colors,
        "position2": positions2,
        "color2": colors2,
        "radius": radii
    };

    var attributeData = {
        "position1": { type: "v3", value: null },
        "color": { type: "v3", value: null },
        "position2": { type: "v3", value: null },
        "color2": { type: "v3", value: null },
        "radius": { type: "f", value: null },
        "mapping": { type: mappingType, value: null }
    };

    this.createImpostorShaderBase(shaderName, mapping, mappingIndices, data, attributeData, count, mappingSize, mappingIndicesSize, mappingItemSize);

    data = null;
    positions = null;
    colors = null;
    positions2 = null;
    colors2 = null;
    radii = null;

  me.posArray = null;
  me.colorArray = null;
  me.pos2Array = null;
  me.color2Array = null;
  me.radiusArray = null;
};

iCn3D.prototype.createImpostorShaderSphere = function (shaderName) { var me = this;
    var positions = new Float32Array( me.posArraySphere );
    var colors = new Float32Array( me.colorArraySphere );
    var radii = new Float32Array( me.radiusArraySphere );

    // sphere
    var mapping = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
         1.0,  1.0,
         1.0, -1.0
    ]);

    var mappingIndices = new Uint16Array([
        0, 1, 2,
        1, 3, 2
    ]);

    var mappingIndicesSize = 6;
    var mappingType = "v2";
    var mappingSize = 4;
    var mappingItemSize = 2;

    var count = positions.length / 3;

    var data = {
        "position": positions,
        "color": colors,
        "radius": radii
    };

    var attributeData = {
        "position": { type: "v3", value: null },
        "color": { type: "v3", value: null },
        "radius": { type: "f", value: null },
        "mapping": { type: mappingType, value: null }
    };

    this.createImpostorShaderBase(shaderName, mapping, mappingIndices, data, attributeData, count, mappingSize, mappingIndicesSize, mappingItemSize);

    data = null;
    positions = null;
    colors = null;
    radii = null;

  me.posArraySphere = null;
  me.colorArraySphere = null;
  me.radiusArraySphere = null;
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3D.prototype.positionFromGeometry = function( mesh ){
    var geometry = mesh.geometry;

    var vertices = geometry.vertices;

    var meshPosition = mesh.position;
    var scale = mesh.scale;
    var matrix = mesh.matrix;

    var j, v3;
    var n = vertices.length;
    //var position = new Float32Array( n * 3 );
    var position = [];

    for( var v = 0; v < n; v++ ){

        j = v * 3;

        if(geometry.type == 'SphereGeometry' || geometry.type == 'BoxGeometry') {
            v3 = vertices[v].clone().multiply(scale).add(meshPosition);
        }
        else if(geometry.type == 'CylinderGeometry') {
            v3 = vertices[v].clone().applyMatrix4(matrix);
        }
        else {
            v3 = vertices[v];
        }

        position[ j + 0 ] = v3.x;
        position[ j + 1 ] = v3.y;
        position[ j + 2 ] = v3.z;
    }

    return position;

};


iCn3D.prototype.colorFromGeometry = function( mesh ){
    var geometry = mesh.geometry;

    var meshColor = new THREE.Color(1, 1, 1);
    if(geometry.type == 'SphereGeometry' || geometry.type == 'BoxGeometry' || geometry.type == 'CylinderGeometry') {
         if(mesh.material !== undefined) meshColor = mesh.material.color;
    }

    var faces = geometry.faces;
    var vn = geometry.vertices.length;

    var bSurfaceVertex = (geometry.type == 'Surface') ? true : false;

    var j, f, c1, c2, c3;
    var n = faces.length;
    //var color = new Float32Array( vn * 3 );
    var color = [];

    for( var v = 0; v < n; v++ ){

        f = faces[ v ];

        if(geometry.type == 'Surface') {
            c1 = f.vertexColors[0];
            c2 = f.vertexColors[1];
            c3 = f.vertexColors[2];
        }
        else if(geometry.type == 'SphereGeometry' || geometry.type == 'BoxGeometry' || geometry.type == 'CylinderGeometry') {
            c1 = meshColor;
            c2 = meshColor;
            c3 = meshColor;
        }
        else {
            c1 = f.color;
            c2 = f.color;
            c3 = f.color;
        }

        j = f.a * 3;
        color[ j + 0 ] = c1.r;
        color[ j + 1 ] = c1.g;
        color[ j + 2 ] = c1.b;

        j = f.b * 3;
        color[ j + 0 ] = c2.r;
        color[ j + 1 ] = c2.g;
        color[ j + 2 ] = c2.b;

        j = f.c * 3;
        color[ j + 0 ] = c3.r;
        color[ j + 1 ] = c3.g;
        color[ j + 2 ] = c3.b;

    }

    return color;

};


iCn3D.prototype.indexFromGeometry = function( mesh ){
    var geometry = mesh.geometry;

    var faces = geometry.faces;

    var j, f;
    var n = faces.length;
    //var TypedArray = n * 3 > 65535 ? Uint32Array : Uint16Array;
    //var index = new TypedArray( n * 3 );
    var index = [];

    for( var v = 0; v < n; v++ ){

        j = v * 3;
        f = faces[ v ];

        index[ j + 0 ] = f.a;
        index[ j + 1 ] = f.b;
        index[ j + 2 ] = f.c;

    }

    return index;

};


iCn3D.prototype.normalFromGeometry = function( mesh ){
    var geometry = mesh.geometry;

    var faces = geometry.faces;
    var vn = geometry.vertices.length;

    var j, f, nn, n1, n2, n3;
    var n = faces.length;
    //var normal = new Float32Array( vn * 3 );
    var normal = [];

    for( var v = 0; v < n; v++ ){

        f = faces[ v ];
        nn = f.vertexNormals;
        n1 = nn[ 0 ];
        n2 = nn[ 1 ];
        n3 = nn[ 2 ];

        j = f.a * 3;
        normal[ j + 0 ] = n1.x;
        normal[ j + 1 ] = n1.y;
        normal[ j + 2 ] = n1.z;

        j = f.b * 3;
        normal[ j + 0 ] = n2.x;
        normal[ j + 1 ] = n2.y;
        normal[ j + 2 ] = n2.z;

        j = f.c * 3;
        normal[ j + 0 ] = n3.x;
        normal[ j + 1 ] = n3.y;
        normal[ j + 2 ] = n3.z;

    }

    return normal;

};

iCn3D.prototype.hashvalue2array = function(hash) {
    //return $.map(hash, function(v) { return v; });

    var array = [];
    for(var i in hash) {
        array.push(hash[i]);
    }

    return array;
};

iCn3D.prototype.drawSymmetryMates = function() {
    //if(this.bInstanced) {
    if(this.bInstanced && Object.keys(this.atoms).length * this.biomtMatrices.length > this.maxatomcnt) {
        this.drawSymmetryMatesInstancing();
    }
    else {
        this.drawSymmetryMatesNoInstancing();
    }
}

iCn3D.prototype.drawSymmetryMatesNoInstancing = function() {
   if (this.biomtMatrices === undefined || this.biomtMatrices.length == 0) return;
   var cnt = 1; // itself
   var centerSum = this.center.clone();

   var identity = new THREE.Matrix4();
   identity.identity();

   for (var i = 0; i < this.biomtMatrices.length; i++) {  // skip itself
      var mat = this.biomtMatrices[i];
      if (mat === undefined) continue;

      // skip itself
      if(mat.equals(identity)) continue;

      var symmetryMate = this.mdl.clone();
      symmetryMate.applyMatrix(mat);

      this.mdl.add(symmetryMate);

      symmetryMate = this.mdlImpostor.clone();
      symmetryMate.applyMatrix(mat);

      //symmetryMate.onBeforeRender = this.onBeforeRender;
      for(var j = symmetryMate.children.length - 1; j >= 0; j--) {
           var mesh = symmetryMate.children[j];
           mesh.onBeforeRender = this.onBeforeRender;
      }

      this.mdlImpostor.add(symmetryMate);

      //symmetryMate = this.mdlPicking.clone();
      //symmetryMate.applyMatrix(mat);

      //this.mdlPicking.add(symmetryMate);

      symmetryMate = this.mdl_ghost.clone();
      symmetryMate.applyMatrix(mat);

      this.mdl_ghost.add(symmetryMate);

      var center = this.center.clone();
      center.applyMatrix4(mat);
      centerSum.add(center);

      ++cnt;
   }

   if(this.bSetInstancing === undefined || !this.bSetInstancing) {
       this.maxD *= Math.sqrt(cnt);

       this.center = centerSum.multiplyScalar(1.0 / cnt);

       this.maxDAssembly = this.maxD;

       this.centerAssembly = this.center.clone();

       this.setCenter(this.center);

       // reset cameara
       this.setCamera();
   }
   else {
       this.maxD = this.maxDAssembly;

       this.center = this.centerAssembly.clone();

       this.setCenter(this.center);

       // reset cameara
       this.setCamera();
   }

   this.bSetInstancing = true;
};

iCn3D.prototype.createInstancedGeometry = function(mesh) {
   var baseGeometry = mesh.geometry;

   var geometry = new THREE.InstancedBufferGeometry();

   var positionArray = [];
   var normalArray = [];
   var colorArray = [];
   var indexArray = [];

   var radiusArray = [];
   var mappingArray = [];
   var position2Array = [];
   var color2Array = [];

   if( baseGeometry.vertices && baseGeometry.faces ){
       this.instancedMaterial = this.getInstancedMaterial('Instancing');

       var positionArray2 = this.positionFromGeometry( mesh );
       var normalArray2 = this.normalFromGeometry( mesh );
       var colorArray2 = this.colorFromGeometry( mesh );
       var indexArray2 = this.indexFromGeometry( mesh );

       positionArray = positionArray.concat(positionArray2);
       normalArray = normalArray.concat(normalArray2);
       colorArray = colorArray.concat(colorArray2);
       indexArray = indexArray.concat(indexArray2);

       var bCylinderArray = [];
       var bCylinder = (baseGeometry.type == 'CylinderGeometry') ? 1.0 : 0.0;
       for(var i = 0, il = positionArray.length / 3; i < il; ++i) {
           bCylinderArray.push(bCylinder);
       }

       geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positionArray), 3));
       geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normalArray), 3) );
       geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray), 3) );

       geometry.addAttribute('cylinder', new THREE.BufferAttribute(new Float32Array(bCylinderArray), 1) );
       geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexArray), 1));

       positionArray2 = null;
       normalArray2 = null;
       colorArray2 = null;
       indexArray2 = null;

   }
   else if(this.bImpo && baseGeometry.attributes.color2 !== undefined) { // cylinder
       this.instancedMaterial = this.getInstancedMaterial('CylinderInstancing');

       var positionArray2 = this.hashvalue2array(baseGeometry.attributes.position1.array);
       var colorArray2 = this.hashvalue2array(baseGeometry.attributes.color.array);

       var positionArray2b = this.hashvalue2array(baseGeometry.attributes.position2.array);
       var colorArray2b = this.hashvalue2array(baseGeometry.attributes.color2.array);

       var indexArray2 = this.hashvalue2array(baseGeometry.index.array);
       var radiusArray2 = this.hashvalue2array(baseGeometry.attributes.radius.array);
       var mappingArray2 = this.hashvalue2array(baseGeometry.attributes.mapping.array);

       positionArray = positionArray.concat(positionArray2);
       colorArray = colorArray.concat(colorArray2);

       position2Array = position2Array.concat(positionArray2b);
       color2Array = color2Array.concat(colorArray2b);

       indexArray = indexArray.concat(indexArray2);
       radiusArray = radiusArray.concat(radiusArray2);
       mappingArray = mappingArray.concat(mappingArray2);

       geometry.addAttribute('position1', new THREE.BufferAttribute(new Float32Array(positionArray), 3));
       geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray), 3) );

       geometry.addAttribute('position2', new THREE.BufferAttribute(new Float32Array(position2Array), 3));
       geometry.addAttribute('color2', new THREE.BufferAttribute(new Float32Array(color2Array), 3) );

       geometry.addAttribute('radius', new THREE.BufferAttribute(new Float32Array(radiusArray), 1) );
       geometry.addAttribute('mapping', new THREE.BufferAttribute(new Float32Array(mappingArray), 3) );
       geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexArray), 1));

       positionArray2 = null;
       colorArray2 = null;
       positionArray2b = null;
       colorArray2b = null;
       indexArray2 = null;
       radiusArray2 = null;
       mappingArray2 = null;
   }
   else if(this.bImpo && baseGeometry.attributes.color !== undefined) { // sphere
       this.instancedMaterial = this.getInstancedMaterial('SphereInstancing');

       var positionArray2 = this.hashvalue2array(baseGeometry.attributes.position.array);
       var colorArray2 = this.hashvalue2array(baseGeometry.attributes.color.array);
       var indexArray2 = this.hashvalue2array(baseGeometry.index.array);
       var radiusArray2 = this.hashvalue2array(baseGeometry.attributes.radius.array);
       var mappingArray2 = this.hashvalue2array(baseGeometry.attributes.mapping.array);

       positionArray = positionArray.concat(positionArray2);
       colorArray = colorArray.concat(colorArray2);
       indexArray = indexArray.concat(indexArray2);
       radiusArray = radiusArray.concat(radiusArray2);
       mappingArray = mappingArray.concat(mappingArray2);

       geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positionArray), 3));
       geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray), 3) );
       geometry.addAttribute('radius', new THREE.BufferAttribute(new Float32Array(radiusArray), 1) );
       geometry.addAttribute('mapping', new THREE.BufferAttribute(new Float32Array(mappingArray), 2) );
       geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexArray), 1));

       positionArray2 = null;
       colorArray2 = null;
       indexArray2 = null;
       radiusArray2 = null;
       mappingArray2 = null;
   }

   positionArray = null;
   normalArray = null;
   colorArray = null;
   indexArray = null;

   radiusArray = null;
   mappingArray = null;
   position2Array = null;
   color2Array = null;

   var matricesAttribute1 = new THREE.InstancedBufferAttribute( new Float32Array( this.matricesElements1 ), 4 );
   var matricesAttribute2 = new THREE.InstancedBufferAttribute( new Float32Array( this.matricesElements2 ), 4 );
   var matricesAttribute3 = new THREE.InstancedBufferAttribute( new Float32Array( this.matricesElements3 ), 4 );
   var matricesAttribute4 = new THREE.InstancedBufferAttribute( new Float32Array( this.matricesElements4 ), 4 );

   geometry.addAttribute( 'matrix1', matricesAttribute1 );
   geometry.addAttribute( 'matrix2', matricesAttribute2 );
   geometry.addAttribute( 'matrix3', matricesAttribute3 );
   geometry.addAttribute( 'matrix4', matricesAttribute4 );

   return geometry;
};

iCn3D.prototype.getInstancedMaterial = function(name) {
   //var material = new THREE.RawShaderMaterial({
   var material = new THREE.ShaderMaterial({
      defines: this.defines,
      uniforms:  this.uniforms,
      vertexShader:   this.getShader(name + ".vert"),
      fragmentShader: this.getShader(name + ".frag"),
      depthTest: true,
      depthWrite: true,
      needsUpdate: true,
      lights: true
   });

   material.extensions.fragDepth = true;
   //https://stackoverflow.com/questions/33094496/three-js-shadermaterial-flatshading
   material.extensions.derivatives = '#extension GL_OES_standard_derivatives : enable';

   return material;
}

iCn3D.prototype.drawSymmetryMatesInstancing = function() {
   if (this.biomtMatrices === undefined || this.biomtMatrices.length == 0) return;
   var cnt = 1; // itself
   var centerSum = this.center.clone();

   this.setParametersForShader();

   if(this.bSetInstancing === undefined || !this.bSetInstancing) {
       //this.offsets = [];
       //this.orientations = [];
       this.matricesElements1 = [];
       this.matricesElements2 = [];
       this.matricesElements3 = [];
       this.matricesElements4 = [];

       var identity = new THREE.Matrix4();
       identity.identity();

       for (var i = 0; i < this.biomtMatrices.length; i++) {  // skip itself
          var mat = this.biomtMatrices[i];
          if (mat === undefined) continue;

          var matArray = mat.toArray();

          // skip itself
          if(mat.equals(identity)) continue;

          this.matricesElements1.push(matArray[0], matArray[1], matArray[2], matArray[3]);
          this.matricesElements2.push(matArray[4], matArray[5], matArray[6], matArray[7]);
          this.matricesElements3.push(matArray[8], matArray[9], matArray[10], matArray[11]);
          this.matricesElements4.push(matArray[12], matArray[13], matArray[14], matArray[15]);

          var center = this.center.clone();
          center.applyMatrix4(mat);
          centerSum.add(center);

          ++cnt;
       }
   }

   for(var i = 0, il = this.mdl.children.length; i < il; ++i) {
       var mesh = this.mdl.children[i];

       if(mesh.type === 'Sprite') continue;

       var geometry = this.createInstancedGeometry(mesh);

       var mesh2 = new THREE.Mesh(geometry, this.instancedMaterial);

       mesh2.onBeforeRender = this.onBeforeRender;

       // important: https://stackoverflow.com/questions/21184061/mesh-suddenly-disappears-in-three-js-clipping
       // You are moving the camera in the CPU. You are moving the vertices of the plane in the GPU
       mesh2.frustumCulled = false;

       geometry = undefined;

       this.mdl.add(mesh2);
   }

   for(var i = 0, il = this.mdlImpostor.children.length; i < il; ++i) {
       var mesh = this.mdlImpostor.children[i];

       var geometry = this.createInstancedGeometry(mesh);

/*
       var material;
       if(mesh.type == 'Sphere') {
         material = this.SphereImpostorMaterial;
       }
       else { //if(mesh.type == 'Cylinder') {
         material = this.CylinderImpostorMaterial;
       }
*/
       var mesh2 = new THREE.Mesh(geometry, this.instancedMaterial);
       //var mesh2 = new THREE.Mesh(geometry, material);

       mesh2.onBeforeRender = this.onBeforeRender;

       // important: https://stackoverflow.com/questions/21184061/mesh-suddenly-disappears-in-three-js-clipping
       // You are moving the camera in the CPU. You are moving the vertices of the plane in the GPU
       mesh2.frustumCulled = false;

       geometry = null;

       this.mdlImpostor.add(mesh2);
   }

   if(this.bSetInstancing === undefined || !this.bSetInstancing) {
       this.maxD *= Math.sqrt(cnt);

       this.center = centerSum.multiplyScalar(1.0 / cnt);

       this.maxDAssembly = this.maxD;

       this.centerAssembly = this.center.clone();

       this.setCenter(this.center);

       // reset cameara
       this.setCamera();
   }
   else {
       this.maxD = this.maxDAssembly;

       this.center = this.centerAssembly.clone();

       this.setCenter(this.center);

       // reset cameara
       this.setCamera();
   }

   this.bSetInstancing = true;
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3D.prototype.cloneHash = function(from) {
  var to = {};
  for(var i in from) {
    to[i] = from[i];
  }

  return to;
};

iCn3D.prototype.residueName2Abbr = function(residueName) {
  if(residueName !== undefined && residueName.charAt(0) !== ' ' && residueName.charAt(1) === ' ') {
    //residueName = 'n' + residueName.charAt(0);
    residueName = residueName.charAt(0);
  }

  switch(residueName) {
    case '  A':
      return 'A';
      break;
    case '  C':
      return 'C';
      break;
    case '  G':
      return 'G';
      break;
    case '  T':
      return 'T';
      break;
    case '  U':
      return 'U';
      break;
    case '  I':
      return 'I';
      break;
    case ' DA':
      return 'A';
      break;
    case ' DC':
      return 'C';
      break;
    case ' DG':
      return 'G';
      break;
    case ' DT':
      return 'T';
      break;
    case ' DU':
      return 'U';
      break;
    case ' DI':
      return 'I';
      break;
    case 'ALA':
      return 'A';
      break;
    case 'ARG':
      return 'R';
      break;
    case 'ASN':
      return 'N';
      break;
    case 'ASP':
      return 'D';
      break;
    case 'CYS':
      return 'C';
      break;
    case 'GLU':
      return 'E';
      break;
    case 'GLN':
      return 'Q';
      break;
    case 'GLY':
      return 'G';
      break;
    case 'HIS':
      return 'H';
      break;
    case 'ILE':
      return 'I';
      break;
    case 'LEU':
      return 'L';
      break;
    case 'LYS':
      return 'K';
      break;
    case 'MET':
      return 'M';
      break;
    case 'PHE':
      return 'F';
      break;
    case 'PRO':
      return 'P';
      break;
    case 'SER':
      return 'S';
      break;
    case 'THR':
      return 'T';
      break;
    case 'TRP':
      return 'W';
      break;
    case 'TYR':
      return 'Y';
      break;
    case 'VAL':
      return 'V';
      break;
    case 'SEC':
      return 'U';
      break;
//        case 'PYL':
//          return 'O';
//          break;

    case 'HOH':
      return 'O';
      break;
    case 'WAT':
      return 'O';
      break;

    default:
      return residueName;
  }
};

iCn3D.prototype.intHash = function(atoms1, atoms2) {
    var results = {};

    if(Object.keys(atoms1).length < Object.keys(atoms2).length) {
        for (var i in atoms1) {
            if (atoms2 !== undefined && atoms2[i]) {
                results[i] = atoms1[i];
            }
        }
    }
    else {
        for (var i in atoms2) {
            if (atoms1 !== undefined && atoms1[i]) {
                results[i] = atoms2[i];
            }
        }
    }

    atoms1 = {};
    atoms2 = {};

    return results;
};

// get atoms in allAtoms, but not in "atoms"
iCn3D.prototype.exclHash = function(includeAtoms, excludeAtoms) {
    var results = {};

    for (var i in includeAtoms) {
        if (!(i in excludeAtoms)) {
            results[i] = includeAtoms[i];
        }
    }

    includeAtoms = {};
    excludeAtoms = {};

    return results;
};

iCn3D.prototype.unionHash = function(atoms1, atoms2) {
    // The commented-out version has a problem: atom1 became undefined.
    //jQuery.extend(atoms1, atoms2);

    //return atoms1;

    return this.unionHashNotInPlace(atoms1, atoms2);
};

iCn3D.prototype.unionHashNotInPlace = function(atoms1, atoms2) {
    var results = jQuery.extend({}, atoms1, atoms2);
    atoms1 = {};
    atoms2 = {};

    return results;
};

iCn3D.prototype.intHash2Atoms = function(atoms1, atoms2) {
    return this.hash2Atoms(this.intHash(atoms1, atoms2));
};

// get atoms in allAtoms, but not in "atoms"
iCn3D.prototype.exclHash2Atoms = function(includeAtoms, excludeAtoms) {
    return this.hash2Atoms(this.exclHash(includeAtoms, excludeAtoms));
};

iCn3D.prototype.unionHash2Atoms = function(atoms1, atoms2) {
    return this.hash2Atoms(this.unionHash(atoms1, atoms2));
};

iCn3D.prototype.hash2Atoms = function(hash) {
    var atoms = {};
    for(var i in hash) {
      atoms[i] = this.atoms[i];
    }

    hash = {};

    return atoms;
};

// from iview (http://istar.cse.cuhk.edu.hk/iview/)
iCn3D.prototype.exportCanvas = function () {
    this.render();
    window.open(this.renderer.domElement.toDataURL('image/png'));
};

// zoom
iCn3D.prototype.zoomIn = function (normalizedFactor) { // 0.1
  var para = {};
  para._zoomFactor = 1 - normalizedFactor;
  para.update = true;
  this.controls.update(para);
  this.render();
};

iCn3D.prototype.zoomOut = function (normalizedFactor) { // 0.1
  var para = {};
  para._zoomFactor = 1 + normalizedFactor;
  para.update = true;
  this.controls.update(para);
  this.render();
};

// rotate
iCn3D.prototype.rotateLeft = function (degree) { // 5
  var axis = new THREE.Vector3(0,1,0);
  var angle = -degree / 180.0 * Math.PI;

  axis.applyQuaternion( this.cam.quaternion ).normalize();

  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle( axis, -angle );

  var para = {};
  para.quaternion = quaternion;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.rotateRight = function (degree) { // 5
  var axis = new THREE.Vector3(0,1,0);
  var angle = degree / 180.0 * Math.PI;

  axis.applyQuaternion( this.cam.quaternion ).normalize();

  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle( axis, -angle );

  var para = {};
  para.quaternion = quaternion;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.rotateUp = function (degree) { // 5
  var axis = new THREE.Vector3(1,0,0);
  var angle = -degree / 180.0 * Math.PI;

  axis.applyQuaternion( this.cam.quaternion ).normalize();

  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle( axis, -angle );

  var para = {};
  para.quaternion = quaternion;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.rotateDown = function (degree) { // 5
  var axis = new THREE.Vector3(1,0,0);
  var angle = degree / 180.0 * Math.PI;

  axis.applyQuaternion( this.cam.quaternion ).normalize();

  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle( axis, -angle );

  var para = {};
  para.quaternion = quaternion;
  para.update = true;

  this.controls.update(para);
  this.render();
};

// translate
iCn3D.prototype.translateLeft = function (percentScreenSize) { // 1
  var mouseChange = new THREE.Vector2(0,0);

  // 1 means the full screen size
  mouseChange.x -= percentScreenSize / 100.0;

  var para = {};
  para.mouseChange = mouseChange;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.translateRight = function (percentScreenSize) { // 1
  var mouseChange = new THREE.Vector2(0,0);

  mouseChange.x += percentScreenSize / 100.0;

  var para = {};
  para.mouseChange = mouseChange;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.translateUp = function (percentScreenSize) { // 1
  var mouseChange = new THREE.Vector2(0,0);

  mouseChange.y -= percentScreenSize / 100.0;

  var para = {};
  para.mouseChange = mouseChange;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.translateDown = function (percentScreenSize) { // 1
  var mouseChange = new THREE.Vector2(0,0);

  mouseChange.y += percentScreenSize / 100.0;

  var para = {};
  para.mouseChange = mouseChange;
  para.update = true;

  this.controls.update(para);
  this.render();
};

iCn3D.prototype.showPickingHilight = function(atom) {
  if(!this.bShift && !this.bCtrl) this.removeHlObjects();

  this.pickedAtomList = {};
  if(this.pk === 1) {
    this.pickedAtomList[atom.serial] = 1;
  }
  else if(this.pk === 2) {
    var residueid = atom.structure + '_' + atom.chain + '_' + atom.resi;
    this.pickedAtomList = this.residues[residueid];
  }
  else if(this.pk === 3) {
    this.pickedAtomList = this.selectStrandHelixFromAtom(atom);
  }
  else if(this.pk === 4) {
    var chainid = atom.structure + '_' + atom.chain;
    this.pickedAtomList = this.chains[chainid];
  }

  if(this.pk === 0) {
      this.bShowHighlight = false;
  }
  else {
      this.bShowHighlight = true;
  }

  var intersectAtoms = (Object.keys(this.hAtoms).length == Object.keys(this.atoms).length) ? {} : this.intHash(this.hAtoms, this.pickedAtomList);
  var intersectAtomsSize = Object.keys(intersectAtoms).length;

  if(!this.bShift && !this.bCtrl) {
      //if(intersectAtomsSize > 0) {
      //    this.hAtoms = this.exclHash(this.hAtoms, this.pickedAtomList);
      //}
      //else {
      //    this.hAtoms = this.cloneHash(this.pickedAtomList);
      //}
      this.hAtoms = this.cloneHash(this.pickedAtomList);
  }
  else if(this.bShift) { // select a range

    if(this.prevPickedAtomList === undefined) {
        this.hAtoms = this.unionHash(this.hAtoms, this.pickedAtomList);
    }
    else {
        var prevAtom = this.getFirstAtomObj(this.prevPickedAtomList);
        var currAtom = this.getFirstAtomObj(this.pickedAtomList);

        var prevChainid = prevAtom.structure + '_' + prevAtom.chain;
        var currChainid = currAtom.structure + '_' + currAtom.chain;

        if(prevChainid != currChainid) {
            this.hAtoms = this.unionHash(this.hAtoms, this.pickedAtomList);
        }
        else { // range in the same chain only
            var combinedAtomList = this.unionHash(this.prevPickedAtomList, this.pickedAtomList);

            var firstAtom = this.getFirstAtomObj(combinedAtomList);
            var lastAtom = this.getLastAtomObj(combinedAtomList);

            for(var i = firstAtom.serial; i <= lastAtom.serial; ++i) {
                this.hAtoms[i] = 1;
            }
        }
    }

    // remember this shift selection
    this.prevPickedAtomList = this.cloneHash(this.pickedAtomList);
  }
  else if(this.bCtrl) {
      if(intersectAtomsSize > 0) {
          this.hAtoms = this.exclHash(this.hAtoms, this.pickedAtomList);
      }
      else {
          this.hAtoms = this.unionHash(this.hAtoms, this.pickedAtomList);
      }
  }

  this.removeHlObjects();
  this.addHlObjects();
};

iCn3D.prototype.showPicking = function(atom, x, y) { var me = this;
    this.showPickingBase(atom, x, y); // including render step
};

iCn3D.prototype.showPickingBase = function(atom, x, y) { var me = this;
  if(x === undefined && y === undefined) { // NOT mouse over
      this.showPickingHilight(atom); // including render step

/*
      //var text = '#' + atom.structure + '.' + atom.chain + ':' + atom.resi + '@' + atom.name;
      var residueText = '.' + atom.chain + ':' + atom.resi;
      var text = residueText + '@' + atom.name;

      var labels = {};
      labels['picking'] = [];

      var label = {};
      label.position = new THREE.Vector3(atom.coord.x + 1, atom.coord.y + 1, atom.coord.z + 1); // shifted by 1

      if(this.pk === 1) {
        label.text = text;
      }
      else if(this.pk === 2) {
        label.text = residueText;
      }
    //  else if(this.pk === 3) {
    //    label.text = residueText;
    //  }

      if(this.pk === 1 || this.pk === 2) {
          labels['picking'].push(label);

          //http://www.johannes-raida.de/tutorials/three.js/tutorial13/tutorial13.htm
          this.createLabelRepresentation(labels);
      }
*/


  }
};

iCn3D.prototype.removeHlObjects = function () {
   // remove prevous highlight
   for(var i in this.prevHighlightObjects) {
       //this.mdlPicking.remove(this.prevHighlightObjects[i]);
       this.mdl.remove(this.prevHighlightObjects[i]);
   }

   this.prevHighlightObjects = [];

   // remove prevous highlight
   for(var i in this.prevHighlightObjects_ghost) {
       //this.mdlPicking.remove(this.prevHighlightObjects_ghost[i]);
       this.mdl.remove(this.prevHighlightObjects_ghost[i]);
   }

   this.prevHighlightObjects_ghost = [];

};

iCn3D.prototype.addHlObjects = function (color, bRender, atomsHash) {
   if(color === undefined) color = this.hColor;
   if(atomsHash === undefined) atomsHash = this.hAtoms;

   this.applyDisplayOptions(this.opts, this.intHash(atomsHash, this.dAtoms), this.bHighlight);

   if(bRender === undefined || bRender) this.render();
};

iCn3D.prototype.resetOrientation = function() {
    var bSet = false;
    if(this.commands.length > 0) {
        var commandTransformation = this.commands[0].split('|||');

        if(commandTransformation.length == 2) {
            var transformation = JSON.parse(commandTransformation[1]);

            this._zoomFactor = transformation.factor;

            this.mouseChange.x = transformation.mouseChange.x;
            this.mouseChange.y = transformation.mouseChange.y;

            this.quaternion._x = transformation.quaternion._x;
            this.quaternion._y = transformation.quaternion._y;
            this.quaternion._z = transformation.quaternion._z;
            this.quaternion._w = transformation.quaternion._w;

            bSet = true;
        }
    }

    if(!bSet) {
        this._zoomFactor = 1.0;
        this.mouseChange = new THREE.Vector2(0,0);
        this.quaternion = new THREE.Quaternion(0,0,0,1);
    }

    //reset this.maxD
    this.maxD = this.oriMaxD;
    this.center = this.oriCenter.clone();

    if(this.ori_chemicalbinding == 'show') {
        this.bSkipChemicalbinding = false;
    }
    else if(this.ori_chemicalbinding == 'hide') {
        this.bSkipChemicalbinding = true;
    }
};

 // from iview (http://istar.cse.cuhk.edu.hk/iview/)
 iCn3D.prototype.getAtomsFromPosition = function(point, threshold) {
    var i, atom;

    if(threshold === undefined || threshold === null) {
      threshold = 1;
    }

    for (i in this.atoms) {
       var atom = this.atoms[i];

       //if(atom.coord.x < point.x - threshold || atom.coord.x > point.x + threshold) continue;
       //if(atom.coord.y < point.y - threshold || atom.coord.y > point.y + threshold) continue;
       //if(atom.coord.z < point.z - threshold || atom.coord.z > point.z + threshold) continue;

       if(this.ions.hasOwnProperty(i) && this.opts['ions'] === 'sphere') {
           var adjust = this.vdwRadii[atom.elem];

           if(Math.abs(atom.coord.x - point.x) - adjust > threshold) continue;
           if(Math.abs(atom.coord.y - point.y) - adjust > threshold) continue;
           if(Math.abs(atom.coord.z - point.z) - adjust > threshold) continue;
       }
       else {
           if(atom.coord.x < point.x - threshold || atom.coord.x > point.x + threshold) continue;
           if(atom.coord.y < point.y - threshold || atom.coord.y > point.y + threshold) continue;
           if(atom.coord.z < point.z - threshold || atom.coord.z > point.z + threshold) continue;
       }

       return atom;
    }

    return null;
 };

iCn3D.prototype.getFirstAtomObj = function(atomsHash) {
    if(atomsHash == undefined) return this.atoms[0];

    var atomKeys = Object.keys(atomsHash);
    var firstIndex = atomKeys[0];

    return this.atoms[firstIndex];
};

iCn3D.prototype.getFirstCalphaAtomObj = function(atomsHash) {
    if(atomsHash == undefined) return this.atoms[0];

    var firstIndex;

    for(var i in atomsHash) {
        if(this.atoms[i].name == 'CA') {
            firstIndex = i;
            break;
        }
    }

    return (firstIndex !== undefined) ? this.atoms[firstIndex] : this.getFirstAtomObj(atomsHash);
};

iCn3D.prototype.getLastAtomObj = function(atomsHash) {
    var atomKeys = Object.keys(atomsHash);
    var lastIndex = atomKeys[atomKeys.length - 1];

    return this.atoms[lastIndex];
};

 // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 iCn3D.prototype.hexToRgb = function (hex, a) {
     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
     return result ? {
         r: parseInt(result[1], 16),
         g: parseInt(result[2], 16),
         b: parseInt(result[3], 16),
         a: a
     } : null;
 };

iCn3D.prototype.selectStrandHelixFromAtom = function(atom) {
    var firstAtom = atom;
    var lastAtom = atom;

    var atomsHash = {};

    // fill the beginning
    var beginResi = firstAtom.resi;
    if(!firstAtom.ssbegin) {
        for(var i = firstAtom.resi - 1; i > 0; --i) {
            var residueid = firstAtom.structure + '_' + firstAtom.chain + '_' + i;
            if(!this.residues.hasOwnProperty(residueid)) break;

            var atom = this.getFirstCalphaAtomObj(this.residues[residueid]);
            beginResi = atom.resi;

            if( (firstAtom.ss !== 'coil' && atom.ss === firstAtom.ss && atom.ssbegin)
              || (firstAtom.ss === 'coil' && atom.ss !== firstAtom.ss) ) {
                if(firstAtom.ss === 'coil' && atom.ss !== firstAtom.ss) {
                    beginResi = atom.resi + 1;
                }
                break;
            }
        }

        for(var i = beginResi; i <= firstAtom.resi; ++i) {
            var residueid = firstAtom.structure + '_' + firstAtom.chain + '_' + i;
            atomsHash = this.unionHash(atomsHash, this.hash2Atoms(this.residues[residueid]));
        }
    }

    // fill the end
    var endResi = lastAtom.resi;
    var endChainResi = this.getLastAtomObj(this.chains[lastAtom.structure + '_' + lastAtom.chain]).resi;
    for(var i = lastAtom.resi + 1; i <= endChainResi; ++i) {
        var residueid = lastAtom.structure + '_' + lastAtom.chain + '_' + i;
        if(!this.residues.hasOwnProperty(residueid)) break;

        var atom = this.getFirstCalphaAtomObj(this.residues[residueid]);
        endResi = atom.resi;

        if( (lastAtom.ss !== 'coil' && atom.ss === lastAtom.ss && atom.ssend) || (lastAtom.ss === 'coil' && atom.ss !== lastAtom.ss) ) {
            if(lastAtom.ss === 'coil' && atom.ss !== lastAtom.ss) {
                endResi = atom.resi - 1;
            }
            break;
        }
    }

    for(var i = lastAtom.resi + 1; i <= endResi; ++i) {
        var residueid = lastAtom.structure + '_' + lastAtom.chain + '_' + i;
        atomsHash = this.unionHash(atomsHash, this.hash2Atoms(this.residues[residueid]));
    }

    return atomsHash;
};

iCn3D.prototype.addNonCarbonAtomLabels = function (atoms) {
    var size = 18;
    var background = "#FFFFFF";

    var atomsHash = this.intHash(this.hAtoms, atoms);

    if(this.labels['schematic'] === undefined) this.labels['schematic'] = [];

    for(var i in atomsHash) {
        var atom = this.atoms[i];

        //if(!atom.het) continue;
        if(!this.residues.hasOwnProperty(atom.structure + '_' + atom.chain + '_' + atom.resi)) continue;
        if(atom.elem === 'C') continue;

        var label = {}; // Each label contains 'position', 'text', 'color', 'background'

        label.position = atom.coord;

        label.bSchematic = 1;

        label.text = atom.elem;
        label.size = size;

        label.color = "#" + atom.color.getHexString();
        label.background = background;

        this.labels['schematic'].push(label);
    }

    this.removeHlObjects();
};

iCn3D.prototype.addResiudeLabels = function (atoms, bSchematic, alpha) {
    var size = 18;
    var background = "#CCCCCC";
    if(alpha === undefined) alpha = 1.0;

    var atomsHash = this.intHash(this.hAtoms, atoms);

    if(bSchematic) {
        if(this.labels['schematic'] === undefined) this.labels['schematic'] = [];
    }
    else {
        if(this.labels['residue'] === undefined) this.labels['residue'] = [];
    }

    var prevReidueID = '';
    for(var i in atomsHash) {
        var atom = this.atoms[i];

        // allow chemicals
        //if(atom.het) continue;

        var label = {}; // Each label contains 'position', 'text', 'color', 'background'

        var currReidueID = atom.structure + '_' + atom.chain + '_' + atom.resi;

        if( (!atom.het && (atom.name === 'CA' || atom.name === "O3'" || atom.name === "O3*") )
          || this.water.hasOwnProperty(atom.serial)
          || this.ions.hasOwnProperty(atom.serial)
          || (this.chemicals.hasOwnProperty(atom.serial) && currReidueID !== prevReidueID) ) {
            label.position = atom.coord;

            label.bSchematic = 0;
            if(bSchematic) label.bSchematic = 1;

            label.text = this.residueName2Abbr(atom.resn);
            label.size = size;

            var atomColorStr = atom.color.getHexString().toUpperCase();
            label.color = (atomColorStr === "CCCCCC" || atomColorStr === "C8C8C8") ? "#888888" : "#" + atomColorStr;
            label.background = background;
            //label.alpha = alpha; // this.hideLabels() didn't work. Remove this line for now

            if(bSchematic) {
                this.labels['schematic'].push(label);
            }
            else {
                this.labels['residue'].push(label);
            }
        }

        prevReidueID = currReidueID;
    }

    this.removeHlObjects();
};

iCn3D.prototype.setCenter = function(center) {
   this.mdl.position.set(0,0,0);
   this.mdlImpostor.position.set(0,0,0);
   this.mdl_ghost.position.set(0,0,0);

   this.mdl.position.sub(center);
   //this.mdlPicking.position.sub(center);
   this.mdlImpostor.position.sub(center);
   this.mdl_ghost.position.sub(center);
};

iCn3D.prototype.getResiduesFromAtoms = function(atomsHash) {
    var residuesHash = {};
    for(var i in atomsHash) {
        var residueid = this.atoms[i].structure + '_' + this.atoms[i].chain + '_' + this.atoms[i].resi;
        residuesHash[residueid] = 1;
    }

    return residuesHash;
};

iCn3D.prototype.getResiduesFromCalphaAtoms = function(atomsHash) {
    var residuesHash = {};
    for(var i in atomsHash) {
        if((this.atoms[i].name == 'CA' && this.proteins.hasOwnProperty(i)) || !this.proteins.hasOwnProperty(i)) {
            var residueid = this.atoms[i].structure + '_' + this.atoms[i].chain + '_' + this.atoms[i].resi;
            residuesHash[residueid] = 1;
        }
    }

    return residuesHash;
};


/*
 * JavaScript Canvas to Blob
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 */

/* global atob, Blob, define */

;(function (window) {
  'use strict'

  var CanvasPrototype =
    window.HTMLCanvasElement && window.HTMLCanvasElement.prototype
  var hasBlobConstructor =
    window.Blob &&
    (function () {
      try {
        return Boolean(new Blob())
      } catch (e) {
        return false
      }
    })()
  var hasArrayBufferViewSupport =
    hasBlobConstructor &&
    window.Uint8Array &&
    (function () {
      try {
        return new Blob([new Uint8Array(100)]).size === 100
      } catch (e) {
        return false
      }
    })()
  var BlobBuilder =
    window.BlobBuilder ||
    window.WebKitBlobBuilder ||
    window.MozBlobBuilder ||
    window.MSBlobBuilder
  var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/
  var dataURLtoBlob =
    (hasBlobConstructor || BlobBuilder) &&
    window.atob &&
    window.ArrayBuffer &&
    window.Uint8Array &&
    function (dataURI) {
      var matches,
        mediaType,
        isBase64,
        dataString,
        byteString,
        arrayBuffer,
        intArray,
        i,
        bb
      // Parse the dataURI components as per RFC 2397
      matches = dataURI.match(dataURIPattern)
      if (!matches) {
        throw new Error('invalid data URI')
      }
      // Default to text/plain;charset=US-ASCII
      mediaType = matches[2]
        ? matches[1]
        : 'text/plain' + (matches[3] || ';charset=US-ASCII')
      isBase64 = !!matches[4]
      dataString = dataURI.slice(matches[0].length)
      if (isBase64) {
        // Convert base64 to raw binary data held in a string:
        byteString = atob(dataString)
      } else {
        // Convert base64/URLEncoded data component to raw binary:
        byteString = decodeURIComponent(dataString)
      }
      // Write the bytes of the string to an ArrayBuffer:
      arrayBuffer = new ArrayBuffer(byteString.length)
      intArray = new Uint8Array(arrayBuffer)
      for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i)
      }
      // Write the ArrayBuffer (or ArrayBufferView) to a blob:
      if (hasBlobConstructor) {
        return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {
          type: mediaType
        })
      }
      bb = new BlobBuilder()
      bb.append(arrayBuffer)
      return bb.getBlob(mediaType)
    }
  if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
    if (CanvasPrototype.mozGetAsFile) {
      CanvasPrototype.toBlob = function (callback, type, quality) {
        var self = this
        setTimeout(function () {
          if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
            callback(dataURLtoBlob(self.toDataURL(type, quality)))
          } else {
            callback(self.mozGetAsFile('blob', type))
          }
        })
      }
    } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
      CanvasPrototype.toBlob = function (callback, type, quality) {
        var self = this
        setTimeout(function () {
          callback(dataURLtoBlob(self.toDataURL(type, quality)))
        })
      }
    }
  }
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return dataURLtoBlob
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = dataURLtoBlob
  } else {
    window.dataURLtoBlob = dataURLtoBlob
  }
})(window)

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.8
 * 2018-03-22 14:03:47
 *
 * By Eli Grey, https://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/src/FileSaver.js */

var saveAs = saveAs || (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
          doc = view.document
          // only get URL when necessary in case Blob.js hasn't overridden it yet
        , get_URL = function() {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function(node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
        , is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
        , setImmediate = view.setImmediate || view.setTimeout
        , throw_outside = function(ex) {
            setImmediate(function() {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        , revoke = function(file) {
            var revoker = function() {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , auto_bom = function(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            //if (blob && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
            }
            return blob;
        }
        , FileSaver = function(blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                  filesaver = this
                , type = (blob) ? blob.type : undefined
                , force = type === force_saveable_type
                , object_url
                , dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                , fs_error = function() {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if(!popup) view.location.href = url;
                            url=undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) object_url = get_URL().createObjectURL(blob);
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                }
            ;
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                if (!object_url) object_url = get_URL().createObjectURL(blob);
                setImmediate(function() {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                }, 0);
                return;
            }

            fs_error();
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function(blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        }
    ;

    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function(blob, name, no_auto_bom) {
            name = name || blob.name || "download";

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    // todo: detect chrome extensions & packaged apps
    //save_link.target = "_blank";

    FS_proto.abort = function(){};
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
    FS_proto.onwritestart =
    FS_proto.onprogress =
    FS_proto.onwrite =
    FS_proto.onabort =
    FS_proto.onerror =
    FS_proto.onwriteend =
        null;

    return saveAs;
}(
       typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this
));

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3D.prototype.rebuildScene = function (options) { var me = this;
    this.rebuildSceneBase(options);

    this.applyDisplayOptions(this.opts, this.dAtoms);
    this.applyCenterOptions();

    this.setCamera();

    //https://stackoverflow.com/questions/15726560/three-js-raycaster-intersection-empty-when-objects-not-part-of-scene
    me.scene_ghost.updateMatrixWorld(true);
};

iCn3D.prototype.draw = function () { var me = this;
    this.rebuildScene();

    // Impostor display using the saved arrays
    if(this.bImpo) {
        this.drawImpostorShader();
    }

    if(this.biomtMatrices !== undefined && this.biomtMatrices.length > 1) {
        if(this.bAssembly) {
            this.drawSymmetryMates();
        }
        else {
            this.centerSelection();
        }
    }

    // show the hAtoms
    if(this.cnt <= this.maxmaxatomcnt && this.hAtoms !== undefined && Object.keys(this.hAtoms).length > 0 && Object.keys(this.hAtoms).length < Object.keys(this.atoms).length) {
        this.removeHlObjects();
        if(this.bShowHighlight === undefined || this.bShowHighlight) this.addHlObjects();
    }

    if(this.bRender === true) {
      this.applyTransformation(this._zoomFactor, this.mouseChange, this.quaternion);
      this.render();
    }

    this.clearImpostors();
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

var iCn3DUI = function(cfg) {
    var me = this;

    me.bFullUi = false;

    me.cfg = cfg;
    me.divid = me.cfg.divid;
    me.pre = me.divid + "_";

    me.inputid = '';

    me.WIDTH = 400; // total width of view area
    me.HEIGHT = 400; // total height of view area

    me.RESIDUE_WIDTH = 10;  // sequences
    me.MENU_HEIGHT = 0; //40;

    // used to set the position for the log/command textarea
    me.MENU_WIDTH = $( window ).width(); //690;

    me.LESSWIDTH = 0;
    me.LESSWIDTH_RESIZE = 20;
    me.LESSHEIGHT = 20;

    me.ROT_DIR = 'right';
    me.bHideSelection = true;
    me.ALTERNATE_STRUCTURE = -1;

    me.EXTRAHEIGHT = 0;

    me.GREY8 = "#888888"; // style protein grey
    me.GREYB = "#BBBBBB";
    me.GREYC = "#CCCCCC"; // grey background
    me.GREYD = "#DDDDDD";

    me.bSelectResidue = false;
    me.bSelectAlignResidue = false;
    me.selectedResidues = {};

    me.bCrashed = false;
    me.prevCommands = "";

    me.opts = {};
    me.opts['camera']             = 'perspective';        //perspective, orthographic
    me.opts['background']         = 'transparent';        //transparent, black, grey, white
    me.opts['color']              = 'chain';              //spectrum, secondary structure, charge, hydrophobic, chain, residue, atom, b factor, red, green, blue, magenta, yellow, cyan, white, grey, custom
    me.opts['proteins']           = 'ribbon';             //ribbon, strand, cylinder and plate, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, nothing
    me.opts['sidec']              = 'nothing';            //lines, stick, ball and stick, sphere, nothing
    me.opts['nucleotides']        = 'nucleotide cartoon'; //nucleotide cartoon, o3 trace, schematic, lines, stick,
                                                              // nucleotides ball and stick, sphere, nothing
    me.opts['surface']            = 'nothing';            //Van der Waals surface, molecular surface, solvent accessible surface, nothing
    me.opts['opacity']            = '1.0';                //1.0, 0.9, 0.8, 0.7, 0.6, 0.5
    me.opts['wireframe']          = 'no';                 //yes, no
    me.opts['map']                = 'nothing';            //2fofc, fofc
    me.opts['mapwireframe']       = 'yes';                //yes, no
    me.opts['chemicals']          = 'stick';              //lines, stick, ball and stick, schematic, sphere, nothing
    me.opts['water']              = 'nothing';            //sphere, dot, nothing
    me.opts['ions']               = 'sphere';             //sphere, dot, nothing
    me.opts['hbonds']             = 'no';                 //yes, no
    me.opts['rotationcenter']     = 'molecule center';    //molecule center, pick center, display center
    me.opts['axis']               = 'no';                 //yes, no
    me.opts['fog']                = 'no';                 //yes, no
    me.opts['slab']               = 'no';                 //yes, no
    me.opts['pk']                 = 'residue';            //no, atom, residue, strand
    me.opts['chemicalbinding']      = 'hide';               //show, hide

    if(me.cfg.cid !== undefined) {
        me.opts['pk'] = 'atom';
        me.opts['chemicals'] = 'ball and stick';
        me.opts['color'] = 'atom';
    }

    if(me.cfg.options !== undefined) jQuery.extend(me.opts, me.cfg.options);

    me.modifyIcn3d();
};

iCn3DUI.prototype = {

    constructor: iCn3DUI,

    // modify me.icn3d function
    modifyIcn3d: function() {var me = this;
        me.modifyIcn3dshowPicking();
    },

    modifyIcn3dshowPicking: function() {var me = this;
        iCn3D.prototype.showPicking = function(atom, x, y) {
          if(me.cfg.cid !== undefined) {
              this.pk = 1; // atom
          }
          else {
              this.pk = 2; // residue
          }

          this.showPickingBase(atom, x, y); // including render step

          if(x !== undefined && y !== undefined) { // mouse over
            var text = (this.pk == 1) ? atom.resn + atom.resi + '@' + atom.name : atom.resn + atom.resi;
            $("#" + me.pre + "popup").html(text);
            $("#" + me.pre + "popup").css("top", y).css("left", x+20).show();
          }

/*
          var residueText = atom.resn + atom.resi;

          var text;
          if(me.cfg.cid !== undefined) {
              text = atom.name;
              this.pk = 1; // atom
          }
          else {
              text = residueText + '@' + atom.name;
              this.pk = 2; // residue
          }

          var labels = {};
          labels['custom'] = [];

          var label = {};
          label.position = new THREE.Vector3(atom.coord.x + 1, atom.coord.y + 1, atom.coord.z + 1); // shifted by 1

          if(this.pk === 1) {
            label.text = text;
          }
          else if(this.pk === 2) {
            label.text = residueText;
          }

          label.background = "#CCCCCC";

          labels['custom'].push(label);

          //http://www.johannes-raida.de/tutorials/three.js/tutorial13/tutorial13.htm
          this.createLabelRepresentation(labels);
*/
        };
    },

    // ======= functions start==============
    // show3DStructure is the main function to show 3D structure
    show3DStructure: function() { var me = this;
        var html = me.setHtml();

        $( "#" + me.divid).html(html);

        me.setViewerWidthHeight();

        var width, height;

        if(me.cfg.width.toString().indexOf('%') !== -1) {
          width = me.WIDTH * me.cfg.width.substr(0, me.cfg.width.toString().indexOf('%')) / 100.0 - me.LESSWIDTH;
        }
        else {
          width = me.cfg.width;
        }

        if(me.cfg.height.toString().indexOf('%') !== -1) {
          height = me.HEIGHT * me.cfg.height.substr(0, me.cfg.height.toString().indexOf('%')) / 100.0 - me.EXTRAHEIGHT - me.LESSHEIGHT;
        }
        else {
          height = me.cfg.height;
        }

        $("#" + me.pre + "viewer").width(width).height(height);
        $("#" + me.pre + "canvas").width(width).height(height);

        if(parseInt(width) <= 200) {
          $("#" + me.pre + "toolbox").hide();
        }

        me.allEventFunctions();

        me.allCustomEvents();

        if(me.cfg.showmenu != undefined && me.cfg.showmenu == false) {
          $("#" + me.pre + "toolbox").hide();
        }
        else {
          $("#" + me.pre + "toolbox").show();
        }

        if(me.cfg.showtitle != undefined && me.cfg.showtitle == false) {
          $("#" + me.pre + "title").hide();
        }
        else {
          $("#" + me.pre + "title").show();
        }

        me.icn3d = new iCn3D(me.pre + 'canvas');
        if(!me.isMobile()) me.icn3d.scaleFactor = 2.0;

        me.handleContextLost();

        if(me.cfg.bCalphaOnly !== undefined) me.icn3d.bCalphaOnly = me.cfg.bCalphaOnly;

        me.loadStructure();
    },

    setHtml: function() { var me = this;
        var html = "";

        html += "<div id='" + me.pre + "viewer' style='position:relative; width:100%; height:100%;'>";

        html += "<div id='" + me.pre + "popup' class='icn3d-text icn3d-popup'></div>";

        html += "<div id='" + me.pre + "title' style='position:absolute; top:20px; left:80px; color:" + me.GREYD + ";'></div>";

        if(me.cfg.mmtfid === undefined) html += "<div id='" + me.pre + "wait' style='width:100%; height: 100%; background-color: rgba(0,0,0, 0.8);'><div style='padding-top:15%; text-align: center; font-size: 2em; color: #FFFF00;'>Loading the structure...</div></div>";

        html += "<canvas id='" + me.pre + "canvas' style='width:100%; height:100%; background-color: #000;'>Your browser does not support WebGL.</canvas>";

        html += "<div class='icn3d-tabBox' id='" + me.pre + "toolbox'>";
        html += "<span class='icn3d-bottomTab'>Tools</span>";
        html += "<div class='icn3d-insideTab' style='overflow: auto;'>";
        html += "<form action='' id='" + me.pre + "paraform' method='POST'>";

        if(me.cfg.cid === undefined) {
        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Proteins&nbsp;</b>";
        html += "<select id='" + me.pre + "proteins'>";
        html += "<option value='ribbon' selected>Ribbon</option>";
        html += "<option value='strand'>Strand</option>";
        html += "<option value='cylinder and plate'>Cylinder and Plate</option>";
        html += "<option value='schematic'>Schematic</option>";
        html += "<option value='c alpha trace'>C Alpha Trace</option>";
        html += "<option value='b factor tube'>B Factor Tube</option>";
        html += "<option value='lines'>Lines</option>";
        html += "<option value='stick'>Stick</option>";
        html += "<option value='ball and stick'>Ball and Stick</option>";
        html += "<option value='sphere'>Sphere</option>";
        html += "<option value='nothing'>Hide</option>";
        html += "</select>";
        html += "</div>";

        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Side Chains&nbsp;</b>";
        html += "<select id='" + me.pre + "sidec'>";
        html += "<option value='lines'>Lines</option>";
        html += "<option value='stick'>Stick</option>";
        html += "<option value='ball and stick'>Ball and Stick</option>";
        html += "<option value='sphere'>Sphere</option>";
        html += "<option value='nothing' selected>Hide</option>";
        html += "</select>";
        html += "</div>";

        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Nucleotides&nbsp;</b>";
        html += "<select id='" + me.pre + "nucleotides'>";
        html += "<option value='nucleotide cartoon' selected>Cartoon</option>";
        html += "<option value='o3 trace'>O3' Trace</option>";
        html += "<option value='schematic'>Schematic</option>";
        html += "<option value='lines'>Lines</option>";
        html += "<option value='stick'>Stick</option>";
        html += "<option value='ball and stick'>Ball and Stick</option>";
        html += "<option value='sphere'>Sphere</option>";
        html += "<option value='nothing'>Hide</option>";
        html += "</select>";
        html += "</div>";

        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Chemicals&nbsp;</b>";
        html += "<select id='" + me.pre + "chemicals'>";
        html += "<option value='lines'>Lines</option>";
        html += "<option value='stick' selected>Stick</option>";
        html += "<option value='ball and stick'>Ball and Stick</option>";
        html += "<option value='schematic'>Schematic</option>";
        html += "<option value='sphere'>Sphere</option>";
        html += "<option value='nothing'>Hide</option>";
        html += "</select>";
        html += "</div>";
        }
        else {
        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Chemicals&nbsp;</b>";
        html += "<select id='" + me.pre + "chemicals'>";
        html += "<option value='lines'>Lines</option>";
        html += "<option value='stick'>Stick</option>";
        html += "<option value='ball and stick' selected>Ball and Stick</option>";
        html += "<option value='schematic'>Schematic</option>";
        html += "<option value='sphere'>Sphere</option>";
        html += "<option value='nothing'>Hide</option>";
        html += "</select>";
        html += "</div>";
        }

        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Color&nbsp;</b>";
        html += "<select id='" + me.pre + "color'>";
        if(me.cfg.cid === undefined) {
            html += "<option value='spectrum'>Spectrum</option>";

            html += "<option value='secondary structure'>Secondary Structure</option>";

            html += "<option value='charge'>Charge</option>";
            html += "<option value='hydrophobic'>Hydrophobic</option>";

            html += "<option value='chain' selected>Chain</option>";

            html += "<option value='residue'>Residue</option>";
            html += "<option value='atom'>Atom</option>";
            html += "<option value='b factor'>B-factor</option>";
        }
        else {
            html += "<option value='atom' selected>Atom</option>";
        }

        if(me.cfg.align !== undefined) {
            html += "<option value='conserved'>Identity</option>";
        }
        html += "<option value='red'>Red</option>";
        html += "<option value='green'>Green</option>";
        html += "<option value='blue'>Blue</option>";
        html += "<option value='magenta'>Magenta</option>";
        html += "<option value='yellow'>Yellow</option>";
        html += "<option value='cyan'>Cyan</option>";
        html += "</select>";
        html += "</div>";

        html += "<div class='icn3d-option'>";
        html += "<b>&nbsp;&nbsp;Camera&nbsp;</b>";
        html += "<select id='" + me.pre + "camera'>";
        html += "<option value='perspective' selected>Perspective</option>";
        html += "<option value='orthographic'>Orthographic</option>";
        html += "</select>";
        html += "</div>";

        if(!me.isMobile()) {
            html += "<div class='icn3d-option'>";

            html += "&nbsp;&nbsp;<b>Select</b>: hold \"Alt\" and select<br/>";
            html += "&nbsp;&nbsp;<b>Union</b>: hold \"Ctrl\" to union<br/>";
            html += "&nbsp;&nbsp;<b>Switch</b>: after picking, press up/down arrow";
            html += "</div>";
        }

        html += "<div class='icn3d-option'>";
        html += "&nbsp;&nbsp;<button id='" + me.pre + "saveimage'>Save Image</button> <button id='" + me.pre + "reset'>Reset</button> <button id='" + me.pre + "help'>Help</button>";
        html += "</div>";

        html += "</form>";
        html += "</div>";
        html += "</div>";

        html += "</div>";

        html += "<!-- dialog will not be part of the form -->";
        html += "<div id='" + me.pre + "alldialogs' class='icn3d-hidden'>";

        // filter for large structure
        //html += "<div id='" + me.pre + "dl_filter' style='overflow:auto; position:relative'>";

        //html += "  <div style='text-align:center; margin-bottom:10px;'><button id='" + me.pre + "filter'><span style='white-space:nowrap'><b>Show Structure</b></span></button>";
        //html += "<button id='" + me.pre + "label_3d_dgm' style='margin-left:10px;'><span style='white-space:nowrap'><b>Show Labels</b></span></button></div>";
        //html += "  <div id='" + me.pre + "dl_filter_table' class='icn3d-box'>";
        //html += "  </div>";
        //html += "</div>";

        html += "</div>";

        return html;
    },

    loadStructure: function() { var me = this;
        me.icn3d.molTitle = '';

        if(me.cfg.mmtfid !== undefined) {
           me.inputid = me.cfg.mmtfid;

           me.downloadMmtf(me.cfg.mmtfid);
        }
        else if(me.cfg.pdbid !== undefined) {
             me.inputid = me.cfg.pdbid;
             var pdbid = me.cfg.pdbid.toLowerCase(); // http://www.rcsb.org/pdb/files/1gpk.pdb only allow lower case

             me.downloadPdb(pdbid);
        }
        else if(me.cfg.mmdbid !== undefined) {
            me.inputid = me.cfg.mmdbid;
            me.downloadMmdb(me.cfg.mmdbid);
        }
        else if(me.cfg.gi !== undefined) {
            me.downloadGi(me.cfg.gi);
        }
        else if(me.cfg.cid !== undefined) {
           me.inputid = me.cfg.cid;
           var url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + me.cfg.cid + "/description/jsonp";
           $.ajax({
              url: url,
              dataType: 'jsonp',
              tryCount : 0,
              retryLimit : 1,
              success: function(data) {
                  if(data.InformationList !== undefined && data.InformationList.Information !== undefined) me.icn3d.molTitle = data.InformationList.Information[0].Title;
              },
              error : function(xhr, textStatus, errorThrown ) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }
                return;
              }
           });

            me.downloadCid(me.cfg.cid);
        }
        else if(me.cfg.mmcifid !== undefined) {
            me.inputid = me.cfg.mmcifid;
            me.downloadMmcif(me.cfg.mmcifid);
        }
        else if(me.cfg.align !== undefined) {
            me.inputid = me.cfg.align;
            me.downloadAlignment(me.cfg.align);
        }
        else if(me.cfg.url !== undefined) {
            var type_url = me.cfg.url.split('|');
            var type = type_url[0];
            var url = type_url[1];

            me.inputid = undefined;

            me.downloadUrl(url, type);
        }
        else {
            alert("Please input a gi, MMDB ID, PDB ID, CID, or mmCIF ID...");
        }
    },

    renderStructure: function(bInitial) { var me = this;
        if(bInitial) {
            //me.icn3d.draw(me.opts);

            jQuery.extend(me.icn3d.opts, me.opts);
            me.icn3d.draw();
        }
        else {
            me.icn3d.draw();
        }
    },

    selectAll: function() { var me = this;
          // select all atoms again
          for(var i in me.icn3d.atoms) {
              me.icn3d.hAtoms[i] = 1;
          }
    },

    setCamera: function(id, value) { var me = this;
      me.icn3d.opts[id] = value;

      me.icn3d.draw();
    },

    setColor: function(id, value) { var me = this;
      me.icn3d.opts[id] = value;

      me.selectAll();

      me.icn3d.setColorByOptions(me.icn3d.opts, me.icn3d.atoms);

      me.icn3d.draw();
    },

    setStyle: function(selectionType, style) { var me = this;
      var atoms = {};

      me.selectAll();

      switch (selectionType) {
          case 'proteins':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.proteins);
              break;
          case 'sidec':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.sidec);
              calpha_atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.calphas);
              // include calphas
              atoms = me.icn3d.unionHash(atoms, calpha_atoms);
              break;
          case 'nucleotides':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.nucleotides);
              break;
          case 'chemicals':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.chemicals);
              break;
          case 'ions':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.ions);
              break;
          case 'water':
              atoms = me.icn3d.intHash(me.icn3d.hAtoms, me.icn3d.water);
              break;
      }

      // draw sidec separatedly
      if(selectionType === 'sidec') {
          for(var i in atoms) {
            me.icn3d.atoms[i].style2 = style;
          }
      }
      else {
          for(var i in atoms) {
            me.icn3d.atoms[i].style = style;
          }
      }

      me.icn3d.opts[selectionType] = style;

      me.icn3d.draw();
    },

    clickTab: function() { var me = this;
        $("#" + me.pre + "toolbox > .icn3d-bottomTab").click(function (e) {
           var height = $("#" + me.pre + "toolbox > .icn3d-insideTab").height();
           if(height === 0) {
                $("#" + me.pre + "toolbox > .icn3d-insideTab").height(260);
           }
           else {
             $("#" + me.pre + "toolbox > .icn3d-insideTab").height(0);
           }
        });
    },

/*
    clickPicking: function() { var me = this;
        $("#" + me.pre + "enablepick").click(function(e) {
           e.preventDefault();

           if(me.cfg.cid !== undefined) {
               me.icn3d.pk = 1;
               me.icn3d.opts['pk'] = 'atom';
           }
           else {
               me.icn3d.pk = 2;
               me.icn3d.opts['pk'] = 'residue';
           }

        });
    },

    clickNoPicking: function() { var me = this;
        $("#" + me.pre + "disablepick").click(function(e) {
           e.preventDefault();

           me.icn3d.pk = 0;
           me.icn3d.opts['pk'] = 'no';
           //me.icn3d.draw(undefined, false);
           me.icn3d.draw();
           me.icn3d.removeHlObjects();

        });
    },
*/

    changeProteinStyle: function() { var me = this;
        $("#" + me.pre + "proteins").change(function(e) {
           e.preventDefault();

           $("#" + me.pre + "sidec").val("nothing");
        });
    },

    clickReset: function() { var me = this;
        $("#" + me.pre + "reset").click(function (e) {
            e.preventDefault();

            //me.loadStructure();
            me.icn3d.resetOrientation();

            me.icn3d.draw();
        });
    },

    clickSaveimage: function() { var me = this;
        $("#" + me.pre + "saveimage").click(function (e) {
            e.preventDefault();

            var file_pref = (me.inputid) ? me.inputid : "custom";

            me.saveFile(file_pref + '_image.png', 'png');
        });
    },

    clickHelp: function() { var me = this;
        $("#" + me.pre + "help").click(function (e) {
            e.preventDefault();

            window.open('https://www.ncbi.nlm.nih.gov/Structure/icn3d/docs/icn3d_help.html', '_blank');
        });
    },

    showSubsets: function() { var me = this;
        $("#" + me.pre + "filter").click(function (e) {
            e.preventDefault();

            var ckbxes = document.getElementsByName(pre + "filter_ckbx");

            var mols = "";

            var chemicalFlag = "&het=0";
            for(var i = 0, il = ckbxes.length; i < il; ++i) { // skip the first "all" checkbox
              if(ckbxes[i].checked) {
                  if(ckbxes[i].value == 'chemicals') {
                      chemicalFlag = "&het=2";
                  }
                  else {
                      mols += ckbxes[i].value + ",";
                   }
              }
            }

            // have to choose one
            if(mols == "") {
                mols = ckbxes[0].value
            }

            var url = document.URL + "&mols=" + mols + "&complexity=2" + chemicalFlag;

            window.open(url, '_self');
        });
    },

    changeSelection: function() { var me = this;
        ['camera', 'color', 'sidec', 'proteins', 'chemicals', 'water', 'ions', 'nucleotides'].forEach(function (opt) {
            $('#' + me.pre + opt).change(function (e) {
                if(opt === 'camera') {
                  me.setCamera(opt, $('#' + me.pre + opt).val());
                }
                else if(opt === 'color') {
                  me.setColor(opt, $('#' + me.pre + opt).val());
                }
                else {
                  me.setStyle(opt, $('#' + me.pre + opt).val());
                }
            });
        });
    },

    allEventFunctions: function() { var me = this;
        me.clickTab();
//        me.clickPicking();
//        me.clickNoPicking();
        me.changeProteinStyle();
        me.clickReset();
        me.clickSaveimage();
        me.clickHelp();
        me.showSubsets();
        //me.clickHighlight_3d_dgm();
        me.windowResize();
        me.changeSelection();
    },

    allCustomEvents: function() { var me = this;
      // add custom events here
    },

    download2Ddgm: function(mmdbid, structureIndex) {var me = this;
      // not used in simple version, but called in common API downloadMmdb()
    }
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

/*! The following are shared by full_ui.js and simple_ui.js */

if (typeof jQuery === 'undefined') { throw new Error('iCn3DUI requires jQuery') }
if (typeof iCn3D === 'undefined') { throw new Error('iCn3DUI requires iCn3D') }

/*
iCn3DUI.prototype.clickHighlight_3d_dgm = function() { var me = this;
    $("#" + me.pre + "highlight_3d_dgm").click(function (e) {
       //e.preventDefault();
       me.icn3d.removeHlObjects();

       var ckbxes = document.getElementsByName(me.pre + "filter_ckbx");

       var mols = "";

       var molid2ssTmp = {}, molid2colorTmp = {};

       me.icn3d.hAtoms = {};
       for(var i = 0, il = ckbxes.length; i < il; ++i) { // skip the first "all" checkbox
         if(ckbxes[i].checked && ckbxes[i].value != 'chemicals') {
           var value = ckbxes[i].value;
           var chain = ckbxes[i].getAttribute('chain');

           if(me.icn3d.molid2ss.hasOwnProperty(value)) { // condensed view
               molid2ssTmp[value] = me.icn3d.molid2ss[value];
               molid2colorTmp[value] = me.icn3d.molid2color[value];
           }
           else { // all atom view
               me.icn3d.hAtoms = me.icn3d.unionHash(me.icn3d.hAtoms, me.icn3d.chains[chain]);
           }
         }
       }

       me.icn3d.drawHelixBrick(molid2ssTmp, molid2colorTmp, me.icn3d.bHighlight); // condensed view
       me.icn3d.addHlObjects(undefined, false); // all atom view

       me.icn3d.render();
    });
};
*/

iCn3DUI.prototype.rotStruc = function (direction, bInitial) { var me = this;
    if(me.icn3d.bStopRotate) return false;
    if(me.icn3d.rotateCount > me.icn3d.rotateCountMax) {
        // back to the original orientation
        me.icn3d.resetOrientation();

        return false;
    }
    ++me.icn3d.rotateCount;

    if(bInitial !== undefined && bInitial) {
        if(direction === 'left') {
          me.ROT_DIR = 'left';
        }
        else if(direction === 'right') {
          me.ROT_DIR = 'right';
        }
        else if(direction === 'up') {
          me.ROT_DIR = 'up';
        }
        else if(direction === 'down') {
          me.ROT_DIR = 'down';
        }
        else {
          return false;
        }
    }

    if(direction === 'left' && me.ROT_DIR === 'left') {
      me.icn3d.rotateLeft(1);
    }
    else if(direction === 'right' && me.ROT_DIR === 'right') {
      me.icn3d.rotateRight(1);
    }
    else if(direction === 'up' && me.ROT_DIR === 'up') {
      me.icn3d.rotateUp(1);
    }
    else if(direction === 'down' && me.ROT_DIR === 'down') {
      me.icn3d.rotateDown(1);
    }
    else {
      return false;
    }

    setTimeout(function(){ me.rotStruc(direction); }, 100);
};

iCn3DUI.prototype.showTitle = function() { var me = this;
    if(me.icn3d.molTitle !== undefined && me.icn3d.molTitle !== '') {
        var title = me.icn3d.molTitle;

        if(me.inputid === undefined) {
            if(me.icn3d.molTitle.length > 40) title = me.icn3d.molTitle.substr(0, 40) + "...";

            $("#" + me.pre + "title").html(title);
        }
        else if(me.cfg.cid !== undefined) {
            var url = me.getLinkToStructureSummary();

            $("#" + me.pre + "title").html("PubChem CID <a href='" + url + "' target='_blank' style='color:" + me.GREYD + "'>" + me.inputid.toUpperCase() + "</a>: " + title);
        }
        else if(me.cfg.align !== undefined) {
            $("#" + me.pre + "title").html(title);
        }
        else {
            var url = me.getLinkToStructureSummary();

            if(me.icn3d.molTitle.length > 40) title = me.icn3d.molTitle.substr(0, 40) + "...";

            //var asymmetricStr = (me.bAssemblyUseAsu) ? " (Asymmetric Unit)" : "";
            var asymmetricStr = "";

            $("#" + me.pre + "title").html("PDB ID <a href='" + url + "' target='_blank' style='color:" + me.GREYD + "'>" + me.inputid.toUpperCase() + "</a>" + asymmetricStr + ": " + title);
        }
    }
    else {
        $("#" + me.pre + "title").html("");
    }
};

iCn3DUI.prototype.getLinkToStructureSummary = function(bLog) { var me = this;

       var url = "https://www.ncbi.nlm.nih.gov/structure/?term=";

       if(me.cfg.cid !== undefined) {
           url = "https://www.ncbi.nlm.nih.gov/pccompound/?term=";
       }
       else {
           if(me.inputid.indexOf(",") !== -1) {
               url = "https://www.ncbi.nlm.nih.gov/structure/?term=";
           }
           else {
               //url = "https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdbsrv.cgi?uid=";
               url = "https://www.ncbi.nlm.nih.gov/Structure/pdb/";
           }
       }

       if(me.inputid === undefined) {
           url = "https://www.ncbi.nlm.nih.gov/pccompound/?term=" + me.molTitle;
       }
       else {
           var idArray = me.inputid.split('_');

           if(idArray.length === 1) {
               url += me.inputid;
               if(bLog !== undefined && bLog) me.setLogCmd("link to Structure Summary " + me.inputid + ": " + url, false);
           }
           else if(idArray.length === 2) {
               url += idArray[0] + " OR " + idArray[1];
               if(bLog !== undefined && bLog) me.setLogCmd("link to structures " + idArray[0] + " and " + idArray[1] + ": " + url, false);
           }
       }

       return url;
},

iCn3DUI.prototype.isIE = function() { var me = this;
    //http://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        return true;
    else                 // If another browser, return 0
        return false;
};

iCn3DUI.prototype.passFloat32 = function( array, output ){ var me = this;
    var n = array.length;
    if( !output ) output = new Uint8Array( 4 * n );
    var dv = me.getDataView( output );
    for( var i = 0; i < n; ++i ){
        dv.setFloat32( 4 * i, array[ i ], true); // litteEndian = true
    };
    return me.getUint8View( output );
};

iCn3DUI.prototype.passInt8 = function( array, output ){ var me = this;
    var n = array.length;
    if( !output ) output = new Uint8Array( 1 * n );
    var dv = me.getDataView( output );
    for( var i = 0; i < n; ++i ){
        dv.setInt8( 1 * i, array[ i ], true); // litteEndian = true
    };
    return me.getUint8View( output );
};

iCn3DUI.prototype.passInt16 = function( array, output ){ var me = this;
    var n = array.length;
    if( !output ) output = new Uint8Array( 2 * n );
    var dv = me.getDataView( output );
    for( var i = 0; i < n; ++i ){
        dv.setInt16( 2 * i, array[ i ], true); // litteEndian = true
    };
    return me.getUint8View( output );
};

iCn3DUI.prototype.passInt32 = function( array, output ){ var me = this;
    var n = array.length;
    if( !output ) output = new Uint8Array( 4 * n );
    var dv = me.getDataView( output );
    for( var i = 0; i < n; ++i ){
        dv.setInt32( 4 * i, array[ i ], true); // litteEndian = true
    };
    return me.getUint8View( output );
};

// ------------

iCn3DUI.prototype.getUint8View = function( typedArray ){ var me = this;
    return me.getView( Uint8Array, typedArray );
};

iCn3DUI.prototype.getDataView = function( typedArray ){ var me = this;
    return me.getView( DataView, typedArray );
};

iCn3DUI.prototype.getView = function( ctor, typedArray, elemSize ){ var me = this;
    return typedArray ? new ctor(
        typedArray.buffer,
        typedArray.byteOffset,
        typedArray.byteLength / ( elemSize || 1 )
    ) : undefined;
};

iCn3DUI.prototype.getBlobFromBufferAndText = function(arrayBuffer, text) { var me = this;
    //var start = "data:image/png;base64,";

    //var strArray0 = new Uint8Array(start.length);
    //for(var i = 0; i < start.length; ++i) {
    //   strArray0[i] = me.passInt8([start.charCodeAt(i)])[0];
    //}

    var strArray = new Uint8Array(arrayBuffer);

    var strArray2 = new Uint8Array(text.length);
    for(var i = 0; i < text.length; ++i) {
       strArray2[i] = me.passInt8([text.charCodeAt(i)])[0];
    }

    var blobArray = []; // hold blobs

    //blobArray.push(new Blob([strArray0],{ type: "application/octet-stream"}));
    blobArray.push(new Blob([strArray],{ type: "application/octet-stream"}));
    blobArray.push(new Blob([strArray2],{ type: "application/octet-stream"}));

    //var blob = new Blob(blobArray,{ type: "application/octet-stream"});
    var blob = new Blob(blobArray,{ type: "image/png"});

    return blob;
};

iCn3DUI.prototype.getTransformationStr = function(transformation) { var me = this;
    var transformation2 = {"factor": 1.0, "mouseChange": {"x": 0, "y": 0}, "quaternion": {"_x": 0, "_y": 0, "_z": 0, "_w": 1} };
    transformation2.factor = parseFloat(transformation.factor).toPrecision(5);
    transformation2.mouseChange.x = parseFloat(transformation.mouseChange.x).toPrecision(5);
    transformation2.mouseChange.y = parseFloat(transformation.mouseChange.y).toPrecision(5);
    transformation2.quaternion._x = parseFloat(transformation.quaternion._x).toPrecision(5);
    transformation2.quaternion._y = parseFloat(transformation.quaternion._y).toPrecision(5);
    transformation2.quaternion._z = parseFloat(transformation.quaternion._z).toPrecision(5);
    transformation2.quaternion._w = parseFloat(transformation.quaternion._w).toPrecision(5);

    if(transformation2.factor == '1.0000') transformation2.factor = 1;
    if(transformation2.mouseChange.x == '0.0000') transformation2.mouseChange.x = 0;
    if(transformation2.mouseChange.y == '0.0000') transformation2.mouseChange.y = 0;

    if(transformation2.quaternion._x == '0.0000') transformation2.quaternion._x = 0;
    if(transformation2.quaternion._y == '0.0000') transformation2.quaternion._y = 0;
    if(transformation2.quaternion._z == '0.0000') transformation2.quaternion._z = 0;
    if(transformation2.quaternion._w == '1.0000') transformation2.quaternion._w = 1;

    return JSON.stringify(transformation2);
};

/*
iCn3DUI.prototype.createLinkForBlob = function(blob, filename) { var me = this;
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
*/

iCn3DUI.prototype.saveFile = function(filename, type, text) { var me = this;
    //Save file
    var blob;

    if(type === 'command') {
        var dataStr = '';
        for(var i = 0, il = me.icn3d.commands.length; i < il; ++i) {
            var command = me.icn3d.commands[i].trim();
            if(i == il - 1) {
               var command_tf = command.split('|||');

               var transformation = {};
               transformation.factor = me.icn3d._zoomFactor;
               transformation.mouseChange = me.icn3d.mouseChange;
               transformation.quaternion = me.icn3d.quaternion;

               command = command_tf[0] + '|||' + me.getTransformationStr(transformation);
            }

            dataStr += command + '\n';
        }
        var data = decodeURIComponent(dataStr);

        blob = new Blob([data],{ type: "text;charset=utf-8;"});
    }
    else if(type === 'png') {
        me.icn3d.render();

        var bAddURL = true;
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            bAddURL = false;
        }

        if(me.isIE()) {
            blob = me.icn3d.renderer.domElement.msToBlob();

            if(bAddURL) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var arrayBuffer = e.target.result; // or = reader.result;

                    var url = me.shareLinkUrl();

                    var text = "";
                    if(me.bInputfile) {
                        text += "\nStart of type file======\n";
                        text += me.InputfileType + "\n";
                        text += "End of type file======\n";

                        text += "Start of data file======\n";
                        text += me.InputfileData;
                        text += "End of data file======\n";

                        text += "Start of state file======\n";
                        text += url;
                        text += "End of state file======\n";
                    }
                    else {
                        text += "\nShare Link: " + url;
                    }

                    blob = me.getBlobFromBufferAndText(arrayBuffer, text);

                    //if(window.navigator.msSaveBlob) navigator.msSaveBlob(blob, filename);
                    saveAs(blob, filename);

                    return;
                };

                reader.readAsArrayBuffer(blob);
            }
        }
        else {
            me.icn3d.renderer.domElement.toBlob(function(data) {
                if(bAddURL) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var arrayBuffer = e.target.result; // or = reader.result;

                        var url = me.shareLinkUrl();

                        var text = "";
                        if(me.bInputfile) {
                            text += "\nStart of type file======\n";
                            text += me.InputfileType + "\n";
                            text += "End of type file======\n";

                            text += "Start of data file======\n";
                            text += me.InputfileData;
                            text += "End of data file======\n";

                            text += "Start of state file======\n";
                            text += url;
                            text += "End of state file======\n";
                        }
                        else {
                            text += "\nShare Link: " + url;
                        }
                        blob = me.getBlobFromBufferAndText(arrayBuffer, text);

                        //me.createLinkForBlob(blob, filename);
                        saveAs(blob, filename);

                        return;
                    };

                    reader.readAsArrayBuffer(data);
                }
                else {
                    blob = data;

                    //me.createLinkForBlob(blob, filename);
                    saveAs(blob, filename);

                    return;
                }
            });
        }
    }
    else if(type === 'html') {
        var dataStr = text;
        var data = decodeURIComponent(dataStr);

        blob = new Blob([data],{ type: "text/html;charset=utf-8;"});
    }
    else if(type === 'text') {
        //var dataStr = text;
        //var data = decodeURIComponent(dataStr);

        //blob = new Blob([data],{ type: "text;charset=utf-8;"});

        var data = text; // here text is an array of text

        blob = new Blob(data,{ type: "text;charset=utf-8;"});
    }
    else if(type === 'binary') {
        var data = text; // here text is an array of blobs

        //blob = new Blob([data],{ type: "application/octet-stream"});
        blob = new Blob(data,{ type: "application/octet-stream"});
    }

/*
    //https://github.com/mholt/PapaParse/issues/175
    //IE11 & Edge
    if(me.isIE() && window.navigator.msSaveBlob){
        navigator.msSaveBlob(blob, filename);
    } else {
        //In FF link must be added to DOM to be clicked
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
*/

    if(type !== 'png') {
        //https://github.com/eligrey/FileSaver.js/
        saveAs(blob, filename);
    }
};


iCn3DUI.prototype.isMobile = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

iCn3DUI.prototype.isMac = function() {
    return /Mac/i.test(navigator.userAgent);
};

iCn3DUI.prototype.isSessionStorageSupported = function() {
  var testKey = 'test';
  try {
    sessionStorage.setItem(testKey, '1');
    sessionStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

iCn3DUI.prototype.resizeCanvas = function (width, height, bForceResize, bDraw) { var me = this;
  if( (bForceResize !== undefined && bForceResize) || (me.cfg.resize !== undefined && me.cfg.resize) ) {
    //var heightTmp = parseInt(height) - me.EXTRAHEIGHT;
    var heightTmp = height;
    $("#" + me.pre + "canvas").width(width).height(heightTmp);

    $("#" + me.pre + "viewer").width(width).height(height);

    me.icn3d.setWidthHeight(width, heightTmp);

    if(bDraw === undefined || bDraw) {
        me.icn3d.draw();
    }
  }
};

iCn3DUI.prototype.handleContextLost = function() { var me = this;
    //https://www.khronos.org/webgl/wiki/HandlingContextLost
    // 1 add a lost context handler and tell it to prevent the default behavior

    var canvas = $("#" + me.pre + "canvas")[0];
    canvas.addEventListener("webglcontextlost", function(event) {
        event.preventDefault();
    }, false);

    // 2 re-setup all your WebGL state and re-create all your WebGL resources when the context is restored.
    canvas.addEventListener("webglcontextrestored", function(event) {
        // IE11 error: WebGL content is taking too long to render on your GPU. Temporarily switching to software rendering.
        console.log("WebGL context was lost. Reset WebGLRenderer and launch iCn3D again.");

        me.icn3d.renderer = new THREE.WebGLRenderer({
            canvas: me.icn3d.container.get(0),
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true
        });

        me.icn3d.draw();

    }, false);
};

iCn3DUI.prototype.windowResize = function() { var me = this;
    if(me.cfg.resize !== undefined && me.cfg.resize && !me.isMobile() ) {
        $(window).resize(function() {
            me.WIDTH = $( window ).width();
            me.HEIGHT = $( window ).height();

            var width = me.WIDTH - me.LESSWIDTH_RESIZE;
            var height = me.HEIGHT - me.LESSHEIGHT - me.EXTRAHEIGHT;

            if(me.icn3d !== undefined) me.resizeCanvas(width, height);
        });
    }
};

iCn3DUI.prototype.setViewerWidthHeight = function() { var me = this;
    me.WIDTH = $( window ).width();
    me.HEIGHT = $( window ).height();

    var viewer_width = $( "#" + me.pre + "viewer" ).width();
    var viewer_height = $( "#" + me.pre + "viewer" ).height();

    if(viewer_width && me.WIDTH > viewer_width) me.WIDTH = viewer_width;
    if(viewer_height && me.HEIGHT > viewer_height) me.HEIGHT = viewer_height;

    if(me.isMac() && me.isMobile()) {
      if(me.WIDTH < me.MENU_WIDTH) me.WIDTH = me.MENU_WIDTH;

      me.HEIGHT = $( window ).height() / $( window ).width() * me.MENU_WIDTH;
    }

    if(me.cfg.width.toString().indexOf('%') === -1) {
        me.WIDTH = parseInt(me.cfg.width) + me.LESSWIDTH;
    }

    if(me.cfg.height.toString().indexOf('%') === -1) {
        me.HEIGHT = parseInt(me.cfg.height) + me.EXTRAHEIGHT + me.LESSHEIGHT;
    }
};

iCn3DUI.prototype.shareLinkUrl = function() { var me = this;
       var url = "https://www.ncbi.nlm.nih.gov/Structure/icn3d/full.html?";

       var pos = -1;
       if(me.cfg.inpara !== undefined) pos = me.cfg.inpara.indexOf('&command=');
       var inparaWithoutCommand = (pos !== -1 ) ? me.cfg.inpara.substr(0, pos) : me.cfg.inpara;

       var start = 0;
       if(inparaWithoutCommand !== undefined) {
         url += inparaWithoutCommand.substr(1) + '&command=';
         start = 1;
       }
       else {
         url += 'command=';
         start = 0;
       }

       if(me.bInputfile) start = 0;

       var transformation = {};
       transformation.factor = me.icn3d._zoomFactor;
       transformation.mouseChange = me.icn3d.mouseChange;
       transformation.quaternion = me.icn3d.quaternion;

       var bCommands = false;
       var statefile = "";
       for(var i = start, il = me.icn3d.commands.length; i < il; ++i) {
           bCommands = true;

           var command_tf = me.icn3d.commands[i].split('|||');
           var commandStr = command_tf[0].trim();

           if(i === il - 1) {
               //var transformation = (command_tf.length > 1) ? ('|||' + command_tf[1]) : '';
               if(i !== 1 && i !== 0) {
                   url += '; ';
               }
               url += commandStr + '|||' + me.getTransformationStr(transformation);
           }
           else if(i === 1) {
               url += commandStr;
           }
           else if(i !== 1 && i !== il - 1) {
               url += '; ' + commandStr;
           }

           statefile += me.icn3d.commands[i] + "\n";
       }

       // remove "&command="
       if(!bCommands) {
           url = url.substr(0, url.length - 9);
       }

       if(me.bInputfile) url = statefile;

       return url;
};

iCn3DUI.prototype.addLabel = function (text, x, y, z, size, color, background, type) { var me = this;
    var label = {}; // Each label contains 'position', 'text', 'color', 'background'

    if(size === '0' || size === '' || size === 'undefined') size = undefined;
    if(color === '0' || color === '' || color === 'undefined') color = undefined;
    if(background === '0' || background === '' || background === 'undefined') background = undefined;

    var position = new THREE.Vector3();
    position.x = x;
    position.y = y;
    position.z = z;

    label.position = position;

    label.text = text;
    label.size = size;
    label.color = color;
    label.background = background;

    if(me.icn3d.labels[type] === undefined) me.icn3d.labels[type] = [];

    if(type !== undefined) {
        me.icn3d.labels[type].push(label);
    }
    else {
        me.icn3d.labels['custom'].push(label);
    }

    me.icn3d.removeHlObjects();

    //me.icn3d.draw();
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3DUI.prototype.showLoading = function () { var me = this;
      if($("#" + me.pre + "wait")) $("#" + me.pre + "wait").show();
      if($("#" + me.pre + "canvas")) $("#" + me.pre + "canvas").hide();
      if($("#" + me.pre + "cmdlog")) $("#" + me.pre + "cmdlog").hide();
};

iCn3DUI.prototype.hideLoading = function () { var me = this;
    if(me.bCommandLoad === undefined || !me.bCommandLoad) {
      if($("#" + me.pre + "wait")) $("#" + me.pre + "wait").hide();
      if($("#" + me.pre + "canvas")) $("#" + me.pre + "canvas").show();
      if($("#" + me.pre + "cmdlog")) $("#" + me.pre + "cmdlog").show();
    }
};

iCn3DUI.prototype.downloadMmcif = function (mmcifid) { var me = this;
   var url, dataType;

   url = "https://files.rcsb.org/view/" + mmcifid + ".cif";

   dataType = "text";

   me.icn3d.bCid = undefined;

   $.ajax({
      url: url,
      dataType: dataType,
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      beforeSend: function() {
          me.showLoading();
      },
      complete: function() {
          me.hideLoading();
      },
      success: function(data) {
           url = "https://www.ncbi.nlm.nih.gov/Structure/mmcifparser/mmcifparser.cgi";
           $.ajax({
              url: url,
              type: 'POST',
              data : {'mmciffile': data},
              dataType: 'jsonp',
              cache: true,
              tryCount : 0,
              retryLimit : 1,
              beforeSend: function() {
                  me.showLoading();
              },
              complete: function() {
                  me.hideLoading();
              },
              success: function(data) {
                  me.loadMmcifData(data);
              },
              error : function(xhr, textStatus, errorThrown ) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }
                return;
              }
            });
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }
        return;
      }
    });
};

iCn3DUI.prototype.downloadMmcifSymmetry = function (mmcifid, type) { var me = this;
  // chain functions together
  me.deferredSymmetry = $.Deferred(function() {
      me.downloadMmcifSymmetryBase(mmcifid, type);
  }); // end of me.deferred = $.Deferred(function() {

  return me.deferredSymmetry.promise();
};

iCn3DUI.prototype.downloadMmcifSymmetryBase = function (mmcifid, type) { var me = this;
   var url, dataType;

   if(me.isMac()) { // safari has a problem in getting data from https://files.rcsb.org/header/
       url = "https://files.rcsb.org/view/" + mmcifid + ".cif";
   }
   else {
       url = "https://files.rcsb.org/header/" + mmcifid + ".cif";
   }

   dataType = "text";

   me.icn3d.bCid = undefined;

   $.ajax({
      url: url,
      dataType: dataType,
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      success: function(data) {
           url = "https://www.ncbi.nlm.nih.gov/Structure/mmcifparser/mmcifparser.cgi";

           $.ajax({
              url: url,
              type: 'POST',
              data : {'mmcifheader': data},
              dataType: 'jsonp',
              cache: true,
              tryCount : 0,
              retryLimit : 1,
              success: function(data) {
                  if(data.emd !== undefined) me.icn3d.emd = data.emd;

                  if(me.bAssemblyUseAsu) me.loadMmcifSymmetry(data);

                  if(type === 'mmtfid' && data.missingseq !== undefined) {
                        // adjust missing residues
                        var maxMissingResi = 0, prevMissingChain = '';
                        var chainMissingResidueArray = {};
                        for(var i = 0, il = data.missingseq.length; i < il; ++i) {

                            var resn = data.missingseq[i].resn;
                            var chain = data.missingseq[i].chain;
                            var resi = data.missingseq[i].resi;

                            var chainNum = mmcifid + '_' + chain;

                            if(chainMissingResidueArray[chainNum] === undefined) chainMissingResidueArray[chainNum] = [];
                            var resObject = {};
                            resObject.resi = resi;
                            resObject.name = me.icn3d.residueName2Abbr(resn).toLowerCase();

                            if(chain != prevMissingChain) {
                                maxMissingResi = 0;
                            }

                            // not all listed residues are considered missing, e.g., PDB ID 4OR2, only the firts four residues are considered missing
                            if(!isNaN(resi) && (prevMissingChain == '' || (chain != prevMissingChain) || (chain == prevMissingChain && resi > maxMissingResi)) ) {
                                chainMissingResidueArray[chainNum].push(resObject);

                                maxMissingResi = resi;
                                prevMissingChain = chain;
                            }
                        }

                        me.icn3d.adjustSeq(chainMissingResidueArray);
                  }

                  if(me.deferredSymmetry !== undefined) me.deferredSymmetry.resolve();
              },
              error : function(xhr, textStatus, errorThrown ) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }

                if(me.deferredSymmetry !== undefined) me.deferredSymmetry.resolve();
                return;
              }
            });
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }

        return;
      }
    });
};

iCn3DUI.prototype.loadMmcifData = function(data) { var me = this;
    if (data.atoms !== undefined) {
        me.icn3d.init();

        if(data.emd !== undefined) me.icn3d.emd = data.emd;

        if(me.icn3d.emd !== undefined) {
          $("#" + me.pre + "mapWrapper1").hide();
          $("#" + me.pre + "mapWrapper2").hide();
          $("#" + me.pre + "mapWrapper3").hide();
        }
        else {
          $("#" + me.pre + "emmapWrapper1").hide();
          $("#" + me.pre + "emmapWrapper2").hide();
          $("#" + me.pre + "emmapWrapper3").hide();
        }

        me.loadAtomDataIn(data, data.mmcif, 'mmcifid');

        if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
            $("#" + me.pre + "alternateWrapper").hide();
        }

        // load assembly info
        var assembly = (data.assembly !== undefined) ? data.assembly : [];
        for(var i = 0, il = assembly.length; i < il; ++i) {
          if (me.icn3d.biomtMatrices[i] == undefined) me.icn3d.biomtMatrices[i] = new THREE.Matrix4().identity();

          for(var j = 0, jl = assembly[i].length; j < jl; ++j) {
            me.icn3d.biomtMatrices[i].elements[j] = assembly[i][j];
          }
        }

        if(me.icn3d.biomtMatrices !== undefined && me.icn3d.biomtMatrices.length > 1) {
            $("#" + me.pre + "assemblyWrapper").show();

            me.icn3d.asuCnt = me.icn3d.biomtMatrices.length;
        }
        else {
            $("#" + me.pre + "assemblyWrapper").hide();
        }

        me.icn3d.setAtomStyleByOptions(me.opts);
        me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);

        me.renderStructure();

        if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

        //if(me.cfg.showseq !== undefined && me.cfg.showseq) me.openDialog(me.pre + 'dl_selectresidues', 'Select residues in sequences');

        if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
    }
    else {
        alert('invalid atoms data.');
        return false;
    }
};

iCn3DUI.prototype.loadMmcifSymmetry = function(data) { var me = this;
    // load assembly info
    var assembly = data.assembly;
    var pmatrix = data.pmatrix;

    for(var i = 0, il = assembly.length; i < il; ++i) {
      var mat4 = new THREE.Matrix4();
      mat4.fromArray(assembly[i]);

      me.icn3d.biomtMatrices[i] = mat4;
    }

    me.icn3d.asuCnt = me.icn3d.biomtMatrices.length;
};

iCn3DUI.prototype.parseMmdbData = function (data) { var me = this;
        if(data.atoms === undefined && data.molid2rescount === undefined) {
            alert('invalid MMDB data.');
            return false;
        }

        me.icn3d.init();

        // used in download2Ddgm()
        me.interactionData = {"moleculeInfor": data.moleculeInfor, "intrac": data.intrac, "intracResidues": data.intracResidues};

        me.mmdb_data = data;

        var id = (data.pdbId !== undefined) ? data.pdbId : data.mmdbId;
        me.inputid = id;

        // get molid2color = {}, chain2molid = {}, molid2chain = {};
        var labelsize = 40;

        //var molid2rescount = data.molid2rescount;
        var molid2rescount = data.moleculeInfor;
        var molid2color = {}, chain2molid = {}, molid2chain = {};
        me.icn3d.chainsColor = {};
        me.icn3d.chainsGene = {};

        var html = "<table width='100%'><tr><td></td><th>#</th><th align='center'>Chain</th><th align='center'>Residue Count</th></tr>";

        var index = 1;
        var chainNameHash = {};
        for(var i in molid2rescount) {
          var color = '#' + ( '000000' + molid2rescount[i].color.toString( 16 ) ).slice( - 6 );
          var chainName = molid2rescount[i].chain.trim();
          if(chainNameHash[chainName] === undefined) {
              chainNameHash[chainName] = 1;
          }
          else {
              ++chainNameHash[chainName];
          }

          var chainNameFinal = (chainNameHash[chainName] === 1) ? chainName : chainName + chainNameHash[chainName].toString();
          var chain = id + '_' + chainNameFinal;
          html += "<tr style='color:" + color + "'><td><input type='checkbox' name='" + me.pre + "filter_ckbx' value='" + i + "' chain='" + chain + "'/></td><td align='center'>" + index + "</td><td align='center'>" + chainNameFinal + "</td><td align='center'>" + molid2rescount[i].resCount + "</td></tr>";

          molid2color[i] = color;
          chain2molid[chain] = i;
          molid2chain[i] = chain;

          me.icn3d.chainsColor[chain] = new THREE.Color(color);

          me.icn3d.chainsGene[chain] = {'geneId': molid2rescount[i].geneId, 'geneSymbol': molid2rescount[i].geneSymbol, 'geneDesc': molid2rescount[i].geneDesc};
          ++index;
        }

        if(me.icn3d.chemicals !== undefined && Object.keys(me.icn3d.chemicals).length > 0) {
          html += "<tr><td><input type='checkbox' name='" + me.pre + "filter_ckbx' value='chemicals'/></td><td align='center'>" + index + "</td><td align='center'>Chemicals</td><td align='center'>" + Object.keys(me.icn3d.chemicals).length + " atoms</td></tr>";
        }

        html += "</table>";

        me.icn3d.molid2color = molid2color;
        me.icn3d.chain2molid = chain2molid;
        me.icn3d.molid2chain = molid2chain;

        //if ((me.cfg.inpara !== undefined && me.cfg.inpara.indexOf('mols=') != -1) || (data.atomCount <= maxatomcnt && data.atoms !== undefined) ) {
        // small structure with all atoms
        // show surface options
        $("#" + me.pre + "accordion5").show();

        me.loadAtomDataIn(data, id, 'mmdbid');

        // "asuAtomCount" is defined when: 1) atom count is over the threshold 2) buidx=1 3) asu atom count is smaller than biological unit atom count
        me.bAssemblyUseAsu = (data.asuAtomCount !== undefined) ? true : false;

/*
        if(me.bAssemblyUseAsu) { // set up symmetric matrices
            $("#" + me.pre + "assemblyWrapper").show();
            me.icn3d.bAssembly = true;

            //me.downloadMmcifSymmetry(id);

            $.when(me.downloadMmcifSymmetry(id)).then(function() {
                me.downloadMmdbPart2();
            });
        }
        else {
            $("#" + me.pre + "assemblyWrapper").hide();
            me.icn3d.bAssembly = false;

            me.downloadMmdbPart2();
        }
*/

        $.when(me.downloadMmcifSymmetry(id)).then(function() {
            me.downloadMmdbPart2();
        });
};

iCn3DUI.prototype.downloadMmdb = function (mmdbid, bGi) { var me = this;
   //var maxatomcnt = (me.cfg.maxatomcnt === undefined) ? 50000 : me.cfg.maxatomcnt;
   //var maxatomcnt = 100000; // asymmetric unit (buidx=0) will be returned if above this threshold

   var url;
/*
   if(bGi !== undefined && bGi) {
       url = "https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdb_strview.cgi?program=w3d&seq=1&b&complexity=3&gi=" + mmdbid + "&ath=" + maxatomcnt;
   }
   else {
       url = "https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdb_strview.cgi?program=w3d&seq=1&b&complexity=3&uid=" + mmdbid + "&ath=" + maxatomcnt;
   }
*/

   // b: b-factor, s: water, ft: pdbsite
   //&ft=1
   if(bGi !== undefined && bGi) {
       url = "https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdb_strview.cgi?v=2&program=icn3d&b=1&s=1&ft=1&gi=" + mmdbid;
   }
   else {
       url = "https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdb_strview.cgi?v=2&program=icn3d&b=1&s=1&ft=1&uid=" + mmdbid;
   }

   me.icn3d.bCid = undefined;

   if(me.cfg.inpara !== undefined) {
     url += me.cfg.inpara;
   }

   if(me.chainids2resids === undefined) me.chainids2resids = {}; // me.chainids2resids[chainid1][chainid2] = [resid, resid]

   $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      beforeSend: function() {
          me.showLoading();
      },
      complete: function() {
          me.hideLoading();
      },
      success: function(data) {
        var bCalphaOnly = me.icn3d.isCalphaPhosOnly(data.atoms); //, 'CA');

        if(bCalphaOnly || data.atomCount <= me.icn3d.maxatomcnt) {
            me.parseMmdbData(data);
        }
        else {
            data = null;

            $.ajax({
              url: url + '&complexity=2', // alpha carbons
              dataType: 'jsonp',
              cache: true,
              tryCount : 0,
              retryLimit : 1,
              beforeSend: function() {
                  me.showLoading();
              },
              complete: function() {
                  me.hideLoading();
              },
              success: function(data2) {
                  me.parseMmdbData(data2);
              },
              error : function(xhr, textStatus, errorThrown ) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }

                if(bGi) {
                  alert("This gi " + mmdbid + " has no corresponding 3D structure...");
                }
                else {
                  alert("This mmdbid " + mmdbid + " with the parameters " + me.cfg.inpara
                    + " may not have 3D structure data. Please visit the summary page for details: https://www.ncbi.nlm.nih.gov/Structure/pdb/" + mmdbid);
                }

                return;
              } // success
            }); // ajax
        }
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }

        if(bGi) {
          alert("This gi " + mmdbid + " has no corresponding 3D structure...");
        }
        else {
          alert("This mmdbid " + mmdbid + " with the parameters " + me.cfg.inpara
            + " may not have 3D structure data. Please visit the summary page for details: https://www.ncbi.nlm.nih.gov/Structure/pdb/" + mmdbid);
        }

        return;
      } // success
    }); // ajax
};

iCn3DUI.prototype.downloadMmdbPart2 = function () { var me = this;
    if(me.bAssemblyUseAsu) { // set up symmetric matrices
        $("#" + me.pre + "assemblyWrapper").show();
        me.icn3d.bAssembly = true;
    }
    else {
        $("#" + me.pre + "assemblyWrapper").hide();
        me.icn3d.bAssembly = false;
    }

    if(me.icn3d.emd !== undefined) {
      $("#" + me.pre + "mapWrapper1").hide();
      $("#" + me.pre + "mapWrapper2").hide();
      $("#" + me.pre + "mapWrapper3").hide();
    }
    else {
      $("#" + me.pre + "emmapWrapper1").hide();
      $("#" + me.pre + "emmapWrapper2").hide();
      $("#" + me.pre + "emmapWrapper3").hide();
    }

    me.icn3d.setAtomStyleByOptions(me.opts);
    // use the original color from cgi output
    if(me.cfg.blast_rep_id !== undefined) {
      me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);
    }
    else {
      me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms, true);
    }

    me.renderStructure();
    if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

    me.html2ddgm = '';
    if(me.cfg.show2d !== undefined && me.cfg.show2d) {
        me.openDialog(me.pre + 'dl_2ddgm', 'Interactions');
        if(me.bFullUi) me.download2Ddgm(me.inputid.toUpperCase());
        //me.download2Ddgm(Object.keys(me.icn3d.structures)[0].toUpperCase());
    }

    if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
        if($("#" + me.pre + "alternateWrapper") !== null) $("#" + me.pre + "alternateWrapper").hide();
    }

    if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
};

iCn3DUI.prototype.downloadGi = function (gi) { var me = this;
    me.icn3d.bCid = undefined;
    var bGi = true;
    me.downloadMmdb(gi, bGi);
};

iCn3DUI.prototype.downloadBlast_rep_id = function (sequence_structure_ids) { var me = this;
    me.icn3d.bCid = undefined;

    var idArray = sequence_structure_ids.split(',');
    me.cfg.query_id = idArray[0];
    me.cfg.blast_rep_id = idArray[1];

    var mmdbid = me.cfg.blast_rep_id.split('_')[0];

    me.downloadMmdb(mmdbid);
};

iCn3DUI.prototype.getMissingResidues = function (seqArray, type, chainid) { var me = this;
    var prevResi = -9999;
    var missingResBegin = 0;
    var bCount = true;

    for(var i = 0, il = seqArray.length; i < il; ++i) {
        var seqName, resiPos;
        // mmdbid: ["0","R","ARG"],["502","V","VAL"]; mmcifid: [1, "ARG"]; align: [1, "0","R","ARG"]
        if(type === 'mmdbid') {
            seqName = seqArray[i][1];
            resiPos = 0;
        }
        else if(type === 'mmcifid') {
            seqName = seqArray[i][1];
            seqName = me.icn3d.residueName2Abbr(seqName);
            resiPos = 0;
        }
        else if(type === 'align') {
            seqName = seqArray[i][2];
            resiPos = 1;
        }

        // fixe some missing residue names such as residue 6 in 5C1M_A
        if(seqName === '') {
            seqName = 'x';
        }

        var resObject = {};
        resObject.resi = i + 1;
        var resi = parseInt(seqArray[i][resiPos]);
        var nextResi = (i == il - 1) ? 9999 : parseInt(seqArray[i+1][resiPos]);

        if(resi !== 0 ||
          (resi === 0 && (prevResi === -1 || nextResi == 1) )
          ) {
            resObject.name = seqName.toLowerCase();

            if(bCount && missingResBegin > 0) {
                if(me.countNextresiArray[chainid] === undefined) me.countNextresiArray[chainid] = [];

                var count_nextresi = [missingResBegin, parseInt(seqArray[i][0])];

                me.countNextresiArray[chainid].push(count_nextresi);

                missingResBegin = 0;
            }

            bCount = false;
        }
        //else if(resi === 0 && prevResi !== -1) { // sometimes resi could be -4, -3, -2, -1, 0 e.g., PDBID 4YPS
        else { // sometimes resi could be -4, -3, -2, -1, 0 e.g., PDBID 4YPS
            resObject.name = seqName.toLowerCase();
            ++missingResBegin;

            //if(me.chainMissingResidueArray[chainid] === undefined) me.chainMissingResidueArray[chainid] = [];
            //me.chainMissingResidueArray[chainid].push(resObject);

            bCount = true;
        }

        if(me.icn3d.chainsSeq[chainid] === undefined) me.icn3d.chainsSeq[chainid] = [];

        var numberStr = '';
        if(resObject.resi % 10 === 0) numberStr = resObject.resi.toString();

        me.icn3d.chainsSeq[chainid].push(resObject);

        prevResi = resi;
    }
};

iCn3DUI.prototype.loadAtomDataIn = function (data, id, type, seqalign) { var me = this;
    //me.icn3d.init();

    var pmin = new THREE.Vector3( 9999, 9999, 9999);
    var pmax = new THREE.Vector3(-9999,-9999,-9999);
    var psum = new THREE.Vector3();

    var atoms = data.atoms;

    var serial = 0;
    var prevResi = 0;

    var serial2structure = {}; // for "align" only
    var mmdbid2pdbid = {}; // for "align" only

    me.pmid = data.pubmedId;

    var chainid2seq = {}, chainid2kind = {}, chainid2color = {};
    me.chainid2title = {};
    me.chainid2sid = {};

    if(type === 'align') {
      //serial2structure
      me.pmid = "";
      var refinedStr = (me.cfg.inpara.indexOf('atype=1') !== -1) ? 'Invariant Core ' : '';
      me.icn3d.molTitle = refinedStr + 'Structure Alignment of ';

      for (var i = 0, il = data.alignedStructures[0].length; i < il; ++i) {
          var structure = data.alignedStructures[0][i];

          if(i === 1) {
              me.icn3d.secondId = structure.pdbId; // set the second pdbid to add indent in the structure and chain mns
          }

          var pdbidTmp = structure.pdbId;
          var mmdbidTmp = structure.mmdbId;

          for(var j = structure.serialInterval[0], jl = structure.serialInterval[1]; j <= jl; ++j) {
              serial2structure[j] = pdbidTmp.toString();
              mmdbid2pdbid[mmdbidTmp] = pdbidTmp;
          }

          for(var j = 0, jl = structure.molecules.length; j < jl; ++j) {
              var chain = structure.molecules[j].chain;
              var kind = structure.molecules[j].kind;
              var title = structure.molecules[j].name;
              var seq = structure.molecules[j].sequence;
              var sid = structure.molecules[j].sid;

              var chainid = pdbidTmp + '_' + chain;

              if(me.bFullUi) chainid2seq[chainid] = seq;
              chainid2kind[chainid] = kind;

              me.chainid2title[chainid] = title;
              if(sid !== undefined) me.chainid2sid[chainid] = sid;
          }

          me.icn3d.molTitle +=  "<a href=\"https://www.ncbi.nlm.nih.gov/Structure/mmdb/mmdbsrv.cgi?uid=" + structure.pdbId.toUpperCase() + "\" target=\"_blank\" style=\"color: " + me.GREYD + ";\">" + structure.pdbId.toUpperCase() + "</a>";

          if(structure.descr !== undefined) me.pmid += structure.descr.pubmedid;
          if(i === 0) {
              me.icn3d.molTitle += " and ";
              if(structure.descr !== undefined) me.pmid += "_";
          }
      }

      me.icn3d.molTitle += ' from VAST+';

    }
    else { // mmdbid or mmcifid
        if(data.descr !== undefined) me.icn3d.molTitle += data.descr.name;

        if(type === 'mmdbid') {
          var pdbidTmp = data.pdbId;
          var chainHash = {};
          for(var molid in data.moleculeInfor) {
              var chain = data.moleculeInfor[molid].chain.trim();
              var chainid = pdbidTmp + '_' + chain;
              if(chainHash.hasOwnProperty(chain)) {
                  ++chainHash[chain];
                  chainid += chainHash[chain];
              }
              else {
                  chainHash[chain] = 1;
              }

              var kind = data.moleculeInfor[molid].kind;
              var color = data.moleculeInfor[molid].color;
              var sid = data.moleculeInfor[molid].sid;

              chainid2kind[chainid] = kind;
              chainid2color[chainid] = color;

              if(sid !== undefined) me.chainid2sid[chainid] = sid;
          }
        }
    }

    me.countNextresiArray = {};
    //me.chainMissingResidueArray = {};
    if(me.bFullUi) {
        if(type === 'mmdbid' || type === 'mmcifid') {
            for(var chain in data.sequences) {
                var seqArray = data.sequences[chain];
                var chainid = id + '_' + chain;
                //if(type === 'mmcifid') chainid = '1_' + chain;

                me.getMissingResidues(seqArray, type, chainid); // assign me.icn3d.chainsSeq
            }
        }
        else if(type === 'align') {
            for(var chainid in chainid2seq) {
                var seqArray = chainid2seq[chainid];

                me.getMissingResidues(seqArray, type, chainid);
            }
        }
    }

    var atomid2serial = {};
    var prevStructureNum = '', prevChainNum = '', prevResidueNum = '';
    var structureNum = '', chainNum = '', residueNum = '';
    var currContinueSeq = '';
    var oldResi, prevOldResi = -999;
    var prevResi = 0; // continuous from 1 for each chain
    var missingResIndex = 0;
    var bChainSeqSet = true;
    var bAddedNewSeq = false;

    // In align, chemicals do not have assigned chains. Assembly will have the same residue id so that two different residues will be combined in one residue. To avoid this, build an array to check for molid
    var resiArray = [];
    var molid, prevMolid = '', prevmmdbId = '';

    // set mmdbMolidResid2mmdbChainResi
    me.mmdbMolidResid2mmdbChainResi = {};

    var bPhosphorusOnly = me.icn3d.isCalphaPhosOnly(atoms); //, "O3'", "O3*") || me.icn3d.isCalphaPhosOnly(atoms, "P");
    var miscCnt = 0;

    biopolymerChainsHash = {};

    for (var i in atoms) {
        ++serial;

        atomid2serial[i] = serial;

        var atm = atoms[i];
        atm.serial = serial;

        var mmdbId;

        if(type === 'mmdbid' || type === 'mmcifid') {
          mmdbId = id; // here mmdbId is pdbid or mmcif id
        }
        else if(type === 'align') {
          mmdbId = serial2structure[serial]; // here mmdbId is pdbid
        }

        var resiCorrection = 0;
        if(type === 'mmdbid' || type === 'align') {
            atm.resi_ori = parseInt(atm.resi); // original PDB residue number, has to be integer
            atm.resi = atm.ids.r; // corrected for residue insertion code

            resiCorrection = atm.resi - atm.resi_ori;
        }
        else {
            atm.resi = parseInt(atm.resi);
        }

        //if(mmdbId !== prevmmdbId) resiArray = [];
        if(atm.chain === undefined && (type === 'mmdbid' || type === 'align')) {
            if(type === 'mmdbid') {
              molid = atm.ids.m;

              if(me.icn3d.molid2chain[molid] !== undefined) {
                  var pos = me.icn3d.molid2chain[molid].indexOf('_');
                  atm.chain = me.icn3d.molid2chain[molid].substr(pos + 1);
              }
              else {
/*
                  if(molid !== prevMolid) {
                      resiArray.push(atm.resi);
                  }

                  var miscName;
                  if($.inArray(atm.resi, resiArray) === resiArray.length - 1) {
                      miscName = 'Misc';
                  }
                  else {
                      miscName = 'Misc2';
                  }
*/
                  var miscName = 'Misc';

                  ++miscCnt;
                  if(chainid2kind[chainNum] === 'solvent' || atm.resn === 'HOH') {
                      atm.resi = miscCnt;
                  }

                  //if all are defined in the chain section, no "Misc" should appear
                  atm.chain = miscName;
              }
            }
            else if(type === 'align') {
              molid = atm.ids.m;

              if(me.icn3d.pdbid_molid2chain[mmdbId + '_' + molid] !== undefined) {
                  atm.chain = me.icn3d.pdbid_molid2chain[mmdbId + '_' + molid];
              }
              else {
/*
                  if(molid !== prevMolid) {
                      resiArray.push(atm.resi);
                  }

                  var miscName;
                  if($.inArray(atm.resi, resiArray) === resiArray.length - 1) {
                      miscName = 'Misc';
                  }
                  else {
                      miscName = 'Misc2';
                  }
*/
                  var miscName = 'Misc';
                  ++miscCnt;
                  if(chainid2kind[chainNum] === 'solvent' || atm.resn === 'HOH') {
                      atm.resi = miscCnt;
                  }

                  // chemicals do not have assigned chains.
                  atm.chain = miscName;
              }
            }
        }
        else {
          atm.chain = (atm.chain === '') ? 'Misc' : atm.chain;
        }

        atm.chain = atm.chain.trim();

        // mmcif has pre-assigned structure in mmcifparser.cgi output
        if(type === 'mmdbid' || type === 'align') {
            atm.structure = mmdbId;
        }

        structureNum = atm.structure;
        chainNum = structureNum + '_' + atm.chain;

        if(chainNum !== prevChainNum) {
            missingResIndex = 0;
            prevResi = 0;
        }

        if(type === 'mmdbid') {
            atm.coord = new THREE.Vector3(atm.coord[0], atm.coord[1], atm.coord[2]);
        }
        else {
            atm.coord = new THREE.Vector3(atm.coord.x, atm.coord.y, atm.coord.z);
        }

        var oneLetterRes = me.icn3d.residueName2Abbr(atm.resn.substr(0, 3));

/*
        // modify resi since MMDB used the same resi as in PDB where resi is not continuous
        // No need to modify mmcif resi
        //if(type === 'mmdbid' || type === 'align') {
        if(type === 'mmdbid') {
            // bfactor
            //if(type === 'mmdbid') atm.b = (atm.b !== undefined) ? atm.b : 1;

            oldResi = atm.resi;

//          if(atm.resi !== prevOldResi && atm.resi !== prevOldResi + 1) {
            if(me.countNextresiArray[chainNum] !== undefined
              && me.countNextresiArray[chainNum][missingResIndex] !== undefined
              && atm.resi === me.countNextresiArray[chainNum][missingResIndex][1] + resiCorrection) {
                // add missed residues
                var count = me.countNextresiArray[chainNum][missingResIndex][0];
                prevResi += count;

                ++missingResIndex;
            }
//          }

            if(molid !== prevMolid) {
                atm.resi = atm.resi; // don't change the assigned resi
            }
            else if(atm.resi !== prevOldResi) {
                atm.resi = prevResi + 1;
            }

            else {
                atm.resi = prevResi;
            }

            prevOldResi = oldResi;
        }
*/

        if( (type === 'mmdbid' || type === 'align') && me.bFullUi ) {
            // set me.mmdbMolidResid2mmdbChainResi
            me.mmdbMolidResid2mmdbChainResi[mmdbId + '_' + atm.ids.m + '_' + atm.ids.r] = mmdbId + '_' + atm.chain + '_' + atm.resi;
        }

        pmin.min(atm.coord);
        pmax.max(atm.coord);
        psum.add(atm.coord);

        var bProtein = (me.cfg.mmcifid === undefined) ? chainid2kind[chainNum] === 'protein' : atm.mt === 'p';
        var bNucleotide = (me.cfg.mmcifid === undefined) ? chainid2kind[chainNum] === 'nucleotide' : atm.mt === 'n';
        var bSolvent = (me.cfg.mmcifid === undefined) ? chainid2kind[chainNum] === 'solvent' : atm.mt === 's';
        // in vastplus.cgi, ions arenotlisted in alignedStructures...molecules, thus chainid2kind[chainNum] === undefined is used.
        // ions will be separated from chemicals later.
        // here "ligand" is used in the cgi output
        //var bChemicalIons = (me.cfg.mmcifid === undefined) ? (chainid2kind[chainNum] === 'ligand' || chainid2kind[chainNum] === 'otherPolymer' || chainid2kind[chainNum] === undefined) : atm.mt === 'l';
        // kind: other, otherPolymer, etc
        var bChemicalIons = (me.cfg.mmcifid === undefined) ? (chainid2kind[chainNum] === 'ligand' || (chainid2kind[chainNum] !== undefined && chainid2kind[chainNum].indexOf('other') !== -1) || chainid2kind[chainNum] === undefined) : atm.mt === 'l';

        if((atm.chain === 'Misc' || chainid2kind[chainNum] === 'other') && biopolymerChainsHash[chainNum] !== 'protein' && biopolymerChainsHash[chainNum] !== 'nucleotide') { // biopolymer, could be protein or nucleotide
            if(atm.name === 'CA') {
                biopolymerChainsHash[chainNum] = 'protein';
            }
            else if(atm.name === 'P') {
                biopolymerChainsHash[chainNum] = 'nucleotide';
            }
            else {
                biopolymerChainsHash[chainNum] = 'chemical';
            }
        }

/*
        // sometimes proteins or nucleotide may input as chemicals
        // use the hash residueColors for protein residues
        var nucleotideRes = {'G': 1, 'A': 1, 'T': 1, 'C': 1, 'U': 1, 'DG': 1, 'DA': 1, 'DT': 1, 'DC': 1, 'DU': 1};
        if(me.icn3d.residueColors.hasOwnProperty(atm.resn)) {
            bProtein = true;
        }
        else if(nucleotideRes.hasOwnProperty(atm.resn)) {
            bNucleotide = true;
        }
*/

        if (bProtein || bNucleotide)
        {
            if (bProtein) {
              me.icn3d.proteins[serial] = 1;

              if (atm.name === 'CA') me.icn3d.calphas[serial] = 1;
              if (atm.name !== 'N' && atm.name !== 'CA' && atm.name !== 'C' && atm.name !== 'O') me.icn3d.sidec[serial] = 1;
            }
            else if (bNucleotide) {
              me.icn3d.nucleotides[serial] = 1;

              //if (atm.name == 'P') me.icn3d.nucleotidesO3[serial] = 1;
              if (atm.name == "O3'" || atm.name == "O3*" || (bPhosphorusOnly && atm.name == 'P') ) {
                  me.icn3d.nucleotidesO3[serial] = 1;
              }
            }

            atm.het = false;
        }
        else if (bSolvent) { // solvent
          me.icn3d.water[serial] = 1;

          atm.het = true;
        }
        else if (bChemicalIons) { // chemicals and ions
          //if (atm.bonds.length === 0) me.icn3d.ions[serial] = 1;
          if (atm.resn === 'HOH' || atm.resn === 'O') {
              me.icn3d.water[serial] = 1;
          }
          else if (atm.elem === atm.resn) {
              me.icn3d.ions[serial] = 1;
          }
          else {
              me.icn3d.chemicals[serial] = 1;
          }

          atm.het = true;
        }

        if(type === 'mmdbid') {
            //atm.color = (!atm.het) ? new THREE.Color(chainid2color[chainNum]) : me.icn3d.atomColors[atm.elem] || me.icn3d.defaultAtomColor;
            if(!atm.het) {
                atm.color = (chainid2color[chainNum] !== undefined) ? new THREE.Color(chainid2color[chainNum]) : me.icn3d.chargeColors[atm.resn];
            }
            else {
                atm.color = me.icn3d.atomColors[atm.elem] || me.icn3d.defaultAtomColor;
            }
        }
        else {
            if(atm.color !== undefined) atm.color = new THREE.Color(atm.color);
        }

        if(atm.resn.charAt(0) !== ' ' && atm.resn.charAt(1) === ' ') {
          atm.resn = atm.resn.charAt(0);
        }

        // double check
        if (atm.resn == 'HOH') me.icn3d.water[serial] = 1

        me.icn3d.atoms[serial] = atm;
        me.icn3d.dAtoms[serial] = 1;
        me.icn3d.hAtoms[serial] = 1;

        // chain level
        var chainid = atm.structure + '_' + atm.chain;
        if (me.icn3d.chains[chainid] === undefined) me.icn3d.chains[chainid] = {};
        me.icn3d.chains[chainid][serial] = 1;

        // residue level
        var residueid = atm.structure + '_' + atm.chain + '_' + atm.resi;
        if (me.icn3d.residues[residueid] === undefined) me.icn3d.residues[residueid] = {};
        me.icn3d.residues[residueid][serial] = 1;

        residueNum = chainNum + '_' + atm.resi;

        // different residue
        if(residueNum !== prevResidueNum) {
            // different chain
            if(chainNum !== prevChainNum) {
                bChainSeqSet = true;

                if(serial !== 1) {
                    if(me.icn3d.structures[prevStructureNum] === undefined) me.icn3d.structures[prevStructureNum] = [];
                    me.icn3d.structures[prevStructureNum].push(prevChainNum);
                }
            }
        }

        me.icn3d.residueId2Name[residueid] = oneLetterRes;

        var secondaries = '-';
        if(atm.ss === 'helix') {
            secondaries = 'H';
        }
        else if(atm.ss === 'sheet') {
            secondaries = 'E';
        }
        else if(atm.het || bNucleotide ) {
            secondaries = 'o';
        }
        else if(!atm.het && me.icn3d.residueColors.hasOwnProperty(atm.resn.toUpperCase()) ) {
            secondaries = 'c';
        }
        else if(atm.ss === 'coil') {
            secondaries = 'c';
        }

        me.icn3d.secondaries[atm.structure + '_' + atm.chain + '_' + atm.resi] = secondaries;

        if( (atm.resi != prevResi || molid != prevMolid) && me.bFullUi) { // mmdbid 1tup has different molid, same resi
          if(me.icn3d.chainsSeq[chainid] === undefined) {
              me.icn3d.chainsSeq[chainid] = [];
              bChainSeqSet = false;
          }

          // me.icn3d.chainsSeq[chainid][atm.resi - 1] should have been defined for major chains
          if( bChainSeqSet && !bAddedNewSeq && me.icn3d.chainsSeq[chainid][atm.resi - 1] !== undefined) {
              me.icn3d.chainsSeq[chainid][atm.resi - 1].name = oneLetterRes;
          }
          else if(!bChainSeqSet || !me.icn3d.chainsSeq[chainid].hasOwnProperty(atm.resi - 1)) {
              var resObject = {};
              resObject.resi = atm.resi;
              resObject.name = oneLetterRes;
              var numberStr = '';
              if(atm.resi % 10 === 0) numberStr = atm.resi.toString();

              me.icn3d.chainsSeq[chainid].push(resObject);

              bAddedNewSeq = true;
          }
        }

        prevResi = atm.resi;

        prevStructureNum = structureNum;
        prevChainNum = chainNum;
        prevResidueNum = residueNum;

        prevMolid = molid;
        prevmmdbId = mmdbId;
    }

    // adjust biopolymer type
    for(var chainid in biopolymerChainsHash) {
        if(Object.keys(me.icn3d.chains[chainid]).length < 10) continue;

        if(biopolymerChainsHash[chainid] === 'chemical') continue;

        for(var serial in me.icn3d.chains[chainid]) {
            var atm = me.icn3d.atoms[serial];

            delete me.icn3d.chemicals[serial];
            atm.het = false;

            if(biopolymerChainsHash[chainid] === 'protein') {
              me.icn3d.proteins[serial] = 1;
              //atm.style = (me.cfg.align !== undefined) ? 'c alpha trace' : 'ribbon';

              if (atm.name === 'CA') me.icn3d.calphas[serial] = 1;
              if (atm.name !== 'N' && atm.name !== 'CA' && atm.name !== 'C' && atm.name !== 'O') me.icn3d.sidec[serial] = 1;
            }
            else if(biopolymerChainsHash[chainid] === 'nucleotide') {
              me.icn3d.nucleotides[serial] = 1;
              //atm.style = 'nucleotide cartoon';

              if (atm.name == "O3'" || atm.name == "O3*" || (bPhosphorusOnly && atm.name == 'P') ) {
                  me.icn3d.nucleotidesO3[serial] = 1;
              }
            }
        }
    }

    // me.icn3d.adjustSeq(me.chainMissingResidueArray);

    // remove the reference
    data.atoms = {};

    // add the last residue set
    if(me.icn3d.structures[structureNum] === undefined) me.icn3d.structures[structureNum] = [];
    me.icn3d.structures[structureNum].push(chainNum);

    // update bonds info
    if(type !== 'mmcifid') {
    for (var i in me.icn3d.atoms) {
        var bondLength = (me.icn3d.atoms[i].bonds === undefined) ? 0 : me.icn3d.atoms[i].bonds.length;

        for(var j = 0; j < bondLength; ++j) {
            me.icn3d.atoms[i].bonds[j] = atomid2serial[me.icn3d.atoms[i].bonds[j]];
        }
    }
    }

    me.icn3d.cnt = serial;

    if(me.icn3d.cnt > me.icn3d.maxatomcnt || (me.icn3d.biomtMatrices !== undefined && me.icn3d.biomtMatrices.length * me.icn3d.cnt > 10 * me.icn3d.maxatomcnt) ) {
        me.opts['proteins'] = 'c alpha trace'; //ribbon, strand, cylinder and plate, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, nothing
        me.opts['nucleotides'] = 'o3 trace'; //nucleotide cartoon, o3 trace, schematic, lines, stick,
    }

    me.icn3d.pmin = pmin;
    me.icn3d.pmax = pmax;
    me.icn3d.maxD = pmax.distanceTo(pmin);
    me.icn3d.center = psum.multiplyScalar(1.0 / me.icn3d.cnt);

    if (me.icn3d.maxD < 5) me.icn3d.maxD = 5;
    me.icn3d.oriMaxD = me.icn3d.maxD;
    me.icn3d.oriCenter = me.icn3d.center.clone();

    // set up disulfide bonds
    if(type === 'mmdbid') {
        var disulfideArray = data.disulfides;

        if(disulfideArray !== undefined) {
            for(var i = 0, il = disulfideArray.length; i < il; ++i) {
                var serial1 = disulfideArray[i][0].ca;
                var serial2 = disulfideArray[i][1].ca;

                var atom1 = me.icn3d.atoms[serial1];
                var atom2 = me.icn3d.atoms[serial2];

                var resid1 = atom1.structure + '_' + atom1.chain + '_' + atom1.resi;
                var resid2 = atom2.structure + '_' + atom2.chain + '_' + atom2.resi;

                if(me.icn3d.ssbondpnts[atom1.structure] === undefined) me.icn3d.ssbondpnts[atom1.structure] = [];

                me.icn3d.ssbondpnts[atom1.structure].push(resid1);
                me.icn3d.ssbondpnts[atom1.structure].push(resid2);
            }
        }
    }
    else if(type === 'mmcifid') {
        var disulfideArray = data.disulfides;

        if(disulfideArray !== undefined) {
            if(me.icn3d.ssbondpnts[id] === undefined) me.icn3d.ssbondpnts[id] = [];

            for(var i = 0, il = disulfideArray.length; i < il; ++i) {
                var resid1 = disulfideArray[i][0];
                var resid2 = disulfideArray[i][1];

                me.icn3d.ssbondpnts[id].push(resid1);
                me.icn3d.ssbondpnts[id].push(resid2);
            }

            // copy disulfide bonds
            var structureArray = Object.keys(me.icn3d.structures);
            for(var s = 0, sl = structureArray.length; s < sl; ++s) {
                var structure = structureArray[s];

                if(structure == id) continue;

                if(me.icn3d.ssbondpnts[structure] === undefined) me.icn3d.ssbondpnts[structure] = [];

                for(var j = 0, jl = me.icn3d.ssbondpnts[id].length; j < jl; ++j) {
                    var ori_resid = me.icn3d.ssbondpnts[id][j];
                    var pos = ori_resid.indexOf('_');
                    var resid = structure + ori_resid.substr(pos);

                    me.icn3d.ssbondpnts[structure].push(resid);
                }
            }
        }
    }
    else if(type === 'align') { // calculate disulfide bonds
        // get all Cys residues
        var structure2cys_resid = {};
        for(var chainid in chainid2seq) {
            if(chainid2kind[chainid] == 'protein') {
                var seq = chainid2seq[chainid];
                var structure = chainid.substr(0, chainid.indexOf('_'));

                for(var i = 0, il = seq.length; i < il; ++i) {
                    // each seq[i] = [1,"1","V","VAL NH3+"],
                    if(seq[i][2] == 'C') {
                        if(structure2cys_resid[structure] == undefined) structure2cys_resid[structure] = [];
                        structure2cys_resid[structure].push(chainid + '_' + seq[i][0]);
                    }
                }
            }
        }

        // determine whether there are disulfide bonds
        // disulfide bond is about 2.05 angstrom
        var distMax = 4; //3; // https://icn3d.page.link/5KRXx6XYfig1fkye7
        var distSqrMax = distMax * distMax;
        for(var structure in structure2cys_resid) {
            var cysArray = structure2cys_resid[structure];

            for(var i = 0, il = cysArray.length; i < il; ++i) {
                for(var j = i + 1, jl = cysArray.length; j < jl; ++j) {
                    var resid1 = cysArray[i];
                    var resid2 = cysArray[j];

                    var coord1 = undefined, coord2 = undefined;
                    for(var serial in me.icn3d.residues[resid1]) {
                        if(me.icn3d.atoms[serial].elem == 'S') {
                            coord1 = me.icn3d.atoms[serial].coord;
                            break;
                        }
                    }
                    for(var serial in me.icn3d.residues[resid2]) {
                        if(me.icn3d.atoms[serial].elem == 'S') {
                            coord2 = me.icn3d.atoms[serial].coord;
                            break;
                        }
                    }

                    if(coord1 === undefined || coord2 === undefined) continue;

                    if(Math.abs(coord1.x - coord2.x) > distMax) continue;
                    if(Math.abs(coord1.y - coord2.y) > distMax) continue;
                    if(Math.abs(coord1.z - coord2.z) > distMax) continue;
                    distSqr = (coord1.x - coord2.x)*(coord1.x - coord2.x) + (coord1.y - coord2.y)*(coord1.y - coord2.y) + (coord1.z - coord2.z)*(coord1.z - coord2.z);

                    if(distSqr < distSqrMax) { // disulfide bond
                        if(me.icn3d.ssbondpnts[structure] === undefined) me.icn3d.ssbondpnts[structure] = [];
                        me.icn3d.ssbondpnts[structure].push(resid1);
                        me.icn3d.ssbondpnts[structure].push(resid2);
                    }
                }
            }
        }
    }

    // set up sequence alignment
    // display the structure right away. load the mns and sequences later
//        setTimeout(function(){
    if(type === 'align' && seqalign !== undefined && me.bFullUi) {
        me.setSeqAlign(seqalign, data.alignedStructures);
    } // if(align

    me.showTitle();

    data = {};
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

// from the 2016 NCBI hackathon in Orlando: https://github.com/NCBI-Hackathons/iCN3D-MMTF
// Contributors: Jiyao Wang, Alexander Rose, Peter Rose
// requires the library mmtf.js
iCn3DUI.prototype.downloadMmtf = function (mmtfid) { var me = this;
    MMTF.fetchReduced(
        mmtfid,
        // onLoad callback
        function( mmtfData ){
            if(mmtfData.numAtoms * 10 > me.icn3d.maxatomcnt) {
                var bFull = false;
                me.parseMmtfData(mmtfData, bFull);
            }
            else {
                mmtfData = null;

                MMTF.fetch(
                    mmtfid,
                    // onLoad callback
                    function( mmtfData2 ){
                        var bFull = true;
                        me.parseMmtfData(mmtfData2, bFull);
                    },
                    // onError callback
                    function( error ){
                        console.error( error )
                    }
                );
            }
        },
        // onError callback
        function( error ){
            console.error( error )
        }
    );
};

iCn3DUI.prototype.parseMmtfData = function (mmtfData, bFull) { var me = this;
    var cnt = mmtfData.numAtoms;

    me.icn3d.init();

    var pmin = new THREE.Vector3( 9999, 9999, 9999);
    var pmax = new THREE.Vector3(-9999,-9999,-9999);
    var psum = new THREE.Vector3();

    var id = mmtfData.structureId;

    me.icn3d.molTitle = mmtfData.title;

    // bioAsembly
    if(mmtfData.bioAssemblyList !== undefined && mmtfData.bioAssemblyList[0]!== undefined && mmtfData.bioAssemblyList[0].transformList.length > 1) {
        me.icn3d.biomtMatrices = [];

        for(var i = 0, il = mmtfData.bioAssemblyList[0].transformList.length; i < il; ++i) {
            //var biomt = new THREE.Matrix4().identity();

            //for(var j = 0, jl = mmtfData.bioAssemblyList[0].transformList[i].matrix.length; j < jl; ++j) {
                //biomt.elements[j] = mmtfData.bioAssemblyList[0].transformList[i].matrix[j];
            //}

            var biomt = new THREE.Matrix4().fromArray(mmtfData.bioAssemblyList[0].transformList[i].matrix).transpose();

            me.icn3d.biomtMatrices.push(biomt);
        }
    }

    if(me.icn3d.biomtMatrices !== undefined && me.icn3d.biomtMatrices.length > 1) {
        $("#" + me.pre + "assemblyWrapper").show();

        me.icn3d.asuCnt = me.icn3d.biomtMatrices.length;
    }
    else {
        $("#" + me.pre + "assemblyWrapper").hide();
    }

    var oriindex2serial = {};

    // save SG atoms in CYS residues
    var SGAtomSerialArray = [];

    var prevSS = 'coil';
    var prevChain = '';
    var prevResi = 0;

    var serial = 0;

    var structure, chain, resn, resi, ss, ssbegin, ssend;
    var het, bProtein, bNucleotide;
    var elem, atomName, coord, b, alt;

    var bModifyResi = false;

    var callbackDict = {
        onModel: function( modelData ){
            structure = (modelData.modelIndex === 0) ? id : id + (modelData.modelIndex + 1).toString();
        },
        onChain: function( chainData ){
            bModifyResi = false;

            chain = chainData.chainName; // or chainData.chainId
            var chainid = structure + '_' + chain;

            if(me.icn3d.structures[structure] === undefined) me.icn3d.structures[structure] = [];
            me.icn3d.structures[structure].push(chainid);

/*
            if(me.icn3d.chainsAnTitle[chainid] === undefined ) me.icn3d.chainsAnTitle[chainid] = [];
            if(me.icn3d.chainsAnTitle[chainid][0] === undefined ) me.icn3d.chainsAnTitle[chainid][0] = [];
            if(me.icn3d.chainsAnTitle[chainid][1] === undefined ) me.icn3d.chainsAnTitle[chainid][1] = [];
            me.icn3d.chainsAnTitle[chainid][0].push('');
            me.icn3d.chainsAnTitle[chainid][1].push('SS');
*/
        },
        onGroup: function( groupData ){
            resn = groupData.groupName;
            resi = groupData.groupId;

            //if(resi == prevResi || bModifyResi) {
            //    bModifyResi = true;
            //    resi = prevResi + 1; // for residue insertion code
            //}

            var resid = structure + '_' + chain + '_' + resi;

            if(groupData.secStruct === 0 || groupData.secStruct === 2 || groupData.secStruct === 4) {
                ss = 'helix';
            }
            else if(groupData.secStruct === 3) {
                ss = 'sheet';
            }
            else if(groupData.secStruct === -1) {
                ss = 'other';
            }
            else {
                ss = 'coil';
            }

            // no residue can be both ssbegin and ssend in DSSP calculated secondary structures
            var bSetPrevSsend = false;

            if(chain !== prevChain) {
                // new chain
                if(ss !== 'coil' && ss !== 'other') {
                    ssbegin = true;
                    ssend = false;
                }
                else {
                    ssbegin = false;
                    ssend = false;
                }

                // set up the end of previous chain
                if(prevSS !== 'coil' && prevSS !== 'other') {
                    var prevResid = structure + '_' + prevChain + '_' + prevResi.toString();

                    for(var i in me.icn3d.residues[prevResid]) {
                        me.icn3d.atoms[i].ssbegin = false;
                        me.icn3d.atoms[i].ssend = true;
                    }
                }
            }
            else if(ss !== prevSS) {
                if(prevSS === 'coil' || prevSS === 'other') {
                    ssbegin = true;
                    ssend = false;
                }
                else if(ss === 'coil' || ss === 'other') {
                    bSetPrevSsend = true;
                    ssbegin = false;
                    ssend = false;
                }
                else if( (prevSS === 'sheet' && ss === 'helix') || (prevSS === 'helix' && ss === 'sheet')) {
                    bSetPrevSsend = true;
                    ssbegin = true;
                    ssend = false;
                }
            }
            else {
                    ssbegin = false;
                    ssend = false;
            }

            if(bSetPrevSsend) {
                var prevResid = structure + '_' + chain + '_' + (resi - 1).toString();
                for(var i in me.icn3d.residues[prevResid]) {
                    me.icn3d.atoms[i].ssbegin = false;
                    me.icn3d.atoms[i].ssend = true;
                }
            }

            prevSS = ss;
            prevChain = chain;
            prevResi = resi;

            het = false;
            bProtein = false;
            bNucleotide = false;
            if(groupData.chemCompType.toLowerCase() === 'non-polymer' || groupData.chemCompType.toLowerCase() === 'other' || groupData.chemCompType.toLowerCase().indexOf('saccharide') !== -1) {
                het = true;
            }
            else if(groupData.chemCompType.toLowerCase().indexOf('peptide') !== -1) {
                bProtein = true;
            }
            else if(groupData.chemCompType.toLowerCase().indexOf('dna') !== -1 || groupData.chemCompType.toLowerCase().indexOf('rna') !== -1) {
                bNucleotide = true;
            }
            else {
                bProtein = true;
            }

              // add sequence information
              var chainid = structure + '_' + chain;

              var resObject = {};
              resObject.resi = resi;
              resObject.name = me.icn3d.residueName2Abbr(resn);

              me.icn3d.residueId2Name[resid] = resObject.name;

              var numberStr = '';
              if(resObject.resi % 10 === 0) numberStr = resObject.resi.toString();

              var secondaries = '-';
              if(ss === 'helix') {
                  secondaries = 'H';
              }
              else if(ss === 'sheet') {
                  secondaries = 'E';
              }
              else if(ss === 'coil') {
                  secondaries = 'c';
              }
              else if(ss === 'other') {
                  secondaries = 'o';
              }

              if(me.icn3d.chainsSeq[chainid] === undefined) me.icn3d.chainsSeq[chainid] = [];
              if(me.bFullUi) me.icn3d.chainsSeq[chainid].push(resObject);

              me.icn3d.secondaries[resid] = secondaries;
        },
        onAtom: function( atomData ){
            elem = atomData.element;
            atomName = atomData.atomName;
            coord = new THREE.Vector3(atomData.xCoord, atomData.yCoord, atomData.zCoord);
            b = atomData.bFactor;

            alt = atomData.altLoc;
            if(atomData.altLoc === '\u0000') { // a temp value, should be ''
                alt = '';
            }

            // skip the atoms where alt is not '' or 'A'
            if(alt === '' || alt === 'A') {
                ++serial;

                if(atomName === 'SG') SGAtomSerialArray.push(serial);

                oriindex2serial[atomData.atomIndex] = serial;

                var atomDetails = {
                    het: het, // optional, used to determine chemicals, water, ions, etc
                    serial: serial,         // required, unique atom id
                    name: atomName,             // required, atom name
                    alt: alt,               // optional, some alternative coordinates
                    resn: resn,             // optional, used to determine protein or nucleotide
                    structure: structure,   // optional, used to identify structure
                    chain: chain,           // optional, used to identify chain
                    resi: resi,             // optional, used to identify residue ID
                    //insc: line.substr(26, 1),
                    coord: coord,           // required, used to draw 3D shape
                    b: b,         // optional, used to draw B-factor tube
                    elem: elem,             // optional, used to determine hydrogen bond
                    bonds: [],              // required, used to connect atoms
                    bondOrder: [],
                    ss: ss,             // optional, used to show secondary structures
                    ssbegin: ssbegin,         // optional, used to show the beginning of secondary structures
                    ssend: ssend            // optional, used to show the end of secondary structures
                };

                me.icn3d.atoms[serial] = atomDetails;

                pmin.min(coord);
                pmax.max(coord);
                psum.add(coord);

                var chainid = structure + '_' + chain;
                var resid = chainid + '_' + resi;

                if(me.icn3d.chains[chainid] === undefined) me.icn3d.chains[chainid] = {};
                me.icn3d.chains[chainid][serial] = 1;

                if(me.icn3d.residues[resid] === undefined) me.icn3d.residues[resid] = {};
                me.icn3d.residues[resid][serial] = 1;

                if (bProtein) {
                  me.icn3d.proteins[serial] = 1;

                  if (atomName === 'CA') me.icn3d.calphas[serial] = 1;
                  if (atomName !== 'N' && atomName !== 'CA' && atomName !== 'C' && atomName !== 'O') me.icn3d.sidec[serial] = 1;
                }
                else if (bNucleotide) {
                  me.icn3d.nucleotides[serial] = 1;

                  if (bFull && (atomName == "O3'" || atomName == "O3*")) {
                      me.icn3d.nucleotidesO3[serial] = 1;
                  }
                  else if (!bFull && atomName == 'P') {
                      me.icn3d.nucleotidesO3[serial] = 1;
                  }
                }
                else {
                  if (elem.toLowerCase() === resn.toLowerCase()) {
                      me.icn3d.ions[serial] = 1;
                  }
                  else if(resn === 'HOH' || resn === 'WAT' || resn === 'SQL' || resn === 'H2O' || resn === 'W' || resn === 'DOD' || resn === 'D3O') {
                      me.icn3d.water[serial] = 1;
                  }
                  else {
                      me.icn3d.chemicals[serial] = 1;
                  }
                }

                me.icn3d.dAtoms[serial] = 1;
                me.icn3d.hAtoms[serial] = 1;
            }
        },
        onBond: function( bondData ){
            var from = oriindex2serial[bondData.atomIndex1];
            var to = oriindex2serial[bondData.atomIndex2];

            if(oriindex2serial.hasOwnProperty(bondData.atomIndex1) && oriindex2serial.hasOwnProperty(bondData.atomIndex2)) { // some alt atoms were skipped
                me.icn3d.atoms[from].bonds.push(to);
                me.icn3d.atoms[to].bonds.push(from);

                if(het) {
                    var order = bondData.bondOrder;

                    me.icn3d.atoms[from].bondOrder.push(order);
                    me.icn3d.atoms[to].bondOrder.push(order);

                    if(order === 2) {
                        me.icn3d.doublebonds[from + '_' + to] = 1;
                        me.icn3d.doublebonds[to + '_' + from] = 1;
                    }
                    else if(order === 3) {
                        me.icn3d.triplebonds[from + '_' + to] = 1;
                        me.icn3d.triplebonds[to + '_' + from] = 1;
                    }
                }
            }
        }
    };

    // traverse
    MMTF.traverse( mmtfData, callbackDict );

    // set up disulfide bonds
    var sgLength = SGAtomSerialArray.length;
    for(var i = 0, il = sgLength; i < il; ++i) {
        for(var j = i+1, jl = sgLength; j < il; ++j) {

            var serial1 = SGAtomSerialArray[i];
            var serial2 = SGAtomSerialArray[j];

            var atom1 = me.icn3d.atoms[serial1];
            var atom2 = me.icn3d.atoms[serial2];

            if($.inArray(serial2, atom1.bonds) !== -1) {
                var resid1 = atom1.structure + '_' + atom1.chain + '_' + atom1.resi;
                var resid2 = atom2.structure + '_' + atom2.chain + '_' + atom2.resi;

                if(me.icn3d.ssbondpnts[atom1.structure] === undefined) me.icn3d.ssbondpnts[atom1.structure] = [];

                me.icn3d.ssbondpnts[atom1.structure].push(resid1);
                me.icn3d.ssbondpnts[atom1.structure].push(resid2);
            }
        }
    }

    me.icn3d.cnt = serial;

    if(me.icn3d.cnt > me.icn3d.maxatomcnt || (me.icn3d.biomtMatrices !== undefined && me.icn3d.biomtMatrices.length * me.icn3d.cnt > 10 * me.icn3d.maxatomcnt) ) {
        me.opts['proteins'] = 'c alpha trace'; //ribbon, strand, cylinder and plate, schematic, c alpha trace, b factor tube, lines, stick, ball and stick, sphere, nothing
        me.opts['nucleotides'] = 'o3 trace'; //nucleotide cartoon, o3 trace, schematic, lines, stick,
    }

    me.icn3d.pmin = pmin;
    me.icn3d.pmax = pmax;
    me.icn3d.maxD = pmax.distanceTo(pmin);
    me.icn3d.center = psum.multiplyScalar(1.0 / me.icn3d.cnt);

    if (me.icn3d.maxD < 5) me.icn3d.maxD = 5;
    me.icn3d.oriMaxD = me.icn3d.maxD;
    me.icn3d.oriCenter = me.icn3d.center.clone();

    if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
        $("#" + me.pre + "alternateWrapper").hide();
    }

    me.icn3d.setAtomStyleByOptions(me.opts);
    me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);

    me.renderStructure();

    me.showTitle();

    if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

    //if(me.cfg.showseq !== undefined && me.cfg.showseq) me.openDialog(me.pre + 'dl_selectresidues', 'Select residues in sequences');

    if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
};



/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3DUI.prototype.downloadPdb = function (pdbid) { var me = this;
   var url, dataType;

   url = "https://files.rcsb.org/view/" + pdbid + ".pdb";

   dataType = "text";

   me.icn3d.bCid = undefined;

   $.ajax({
      url: url,
      dataType: dataType,
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      beforeSend: function() {
          me.showLoading();
      },
      complete: function() {
          me.hideLoading();
      },
      success: function(data) {
          me.loadPdbData(data);
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }
        return;
      }
   });
};

iCn3DUI.prototype.downloadUrl = function (url, type) { var me = this;
   var dataType = "text";

   me.icn3d.bCid = undefined;

   //var url = '//www.ncbi.nlm.nih.gov/Structure/mmcifparser/mmcifparser.cgi?dataurl=' + encodeURIComponent(url);

   $.ajax({
      url: url,
      dataType: dataType,
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      beforeSend: function() {
          if($("#" + me.pre + "wait")) $("#" + me.pre + "wait").show();
          if($("#" + me.pre + "canvas")) $("#" + me.pre + "canvas").hide();
          if($("#" + me.pre + "cmdlog")) $("#" + me.pre + "cmdlog").hide();
      },
      complete: function() {
          if($("#" + me.pre + "wait")) $("#" + me.pre + "wait").hide();
          if($("#" + me.pre + "canvas")) $("#" + me.pre + "canvas").show();
          if($("#" + me.pre + "cmdlog")) $("#" + me.pre + "cmdlog").show();
      },
      success: function(data) {
        me.InputfileData = data;
        me.InputfileType = type;

        if(type === 'pdb') {
            me.loadPdbData(data);
        }
        else if(type === 'mol2') {
            me.loadMol2Data(data);
        }
        else if(type === 'sdf') {
            me.loadSdfData(data);
        }
        else if(type === 'xyz') {
            me.loadXyzData(data);
        }
        else if(type === 'mmcif') {
            me.loadMmcifData(data);
        }
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }
        return;
      }
   });
};

iCn3DUI.prototype.loadPdbData = function(data) { var me = this;
      me.icn3d.loadPDB(data); // defined in the core library

      if(me.icn3d.biomtMatrices !== undefined && me.icn3d.biomtMatrices.length > 1) {
        $("#" + me.pre + "assemblyWrapper").show();

        me.icn3d.asuCnt = me.icn3d.biomtMatrices.length;
      }
      else {
        $("#" + me.pre + "assemblyWrapper").hide();
      }

      if(me.icn3d.emd !== undefined) {
          $("#" + me.pre + "mapWrapper1").hide();
          $("#" + me.pre + "mapWrapper2").hide();
          $("#" + me.pre + "mapWrapper3").hide();
      }
      else {
          $("#" + me.pre + "emmapWrapper1").hide();
          $("#" + me.pre + "emmapWrapper2").hide();
          $("#" + me.pre + "emmapWrapper3").hide();
      }

    // calculate secondary structures if not available
    // DSSP only works for structures with all atoms. The Calpha only strucutres didn't work
    //if(!me.icn3d.bSecondaryStructure && !bCalphaOnly) {
    if(!me.icn3d.bSecondaryStructure) {
      me.deferredSecondary = $.Deferred(function() {
          var bCalphaOnly = me.icn3d.isCalphaPhosOnly(me.icn3d.hash2Atoms(me.icn3d.proteins));//, 'CA');
          var calphaonly = (bCalphaOnly) ? '1' : '0';

          me.loadPdbDataBase(data, calphaonly);
      }); // end of me.deferred = $.Deferred(function() {

      return me.deferredSecondary.promise();
    }
    else {
        me.loadPdbDataRender();
    }
};

iCn3DUI.prototype.loadPdbDataBase = function(data, calphaonly) { var me = this;
   var url = "https://www.ncbi.nlm.nih.gov/Structure/mmcifparser/mmcifparser.cgi";

   $.ajax({
      url: url,
      type: 'POST',
      data: {'dssp':'t', 'calphaonly': calphaonly, 'pdbfile': data},
      dataType: 'jsonp',
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      success: function(ssdata) {
        var ssHash = ssdata;

        if(JSON.stringify(ssdata).indexOf('Oops there was a problem') === -1) {
          for(var chainNum in me.icn3d.chainsSeq) {
              var pos = chainNum.indexOf('_');
              var chain = chainNum.substr(pos + 1);

              var residueObjectArray = me.icn3d.chainsSeq[chainNum];
              var prevSS = 'coil';

              for(var i = 0, il = residueObjectArray.length; i < il; ++i) {
                var resi = residueObjectArray[i].resi;
                var chain_resi = chain + '_' + resi;

                var ssOneLetter = 'c';
                if(ssHash.hasOwnProperty(chain_resi)) {
                    ssOneLetter = ssHash[chain_resi];
                }

                var ss;
                if(ssOneLetter === 'H') {
                    ss = 'helix';
                }
                else if(ssOneLetter === 'E') {
                    ss = 'sheet';
                }
                else {
                    ss = 'coil';
                }

                // update ss in sequence window
                //me.icn3d.chainsAn[chainNum][1][i] = ssOneLetter;

                // assign atom ss, ssbegin, and ssend
                var resid = chainNum + '_' + resi;

                me.icn3d.secondaries[resid] = ssOneLetter;

                // no residue can be both ssbegin and ssend in DSSP calculated secondary structures
                var bSetPrevResidue = 0; // 0: no need to reset, 1: reset previous residue to "ssbegin = true", 2: reset previous residue to "ssend = true"

                if(ss !== prevSS) {
                    if(prevSS === 'coil') {
                        ssbegin = true;
                        ssend = false;
                    }
                    else if(ss === 'coil') {
                        bSetPrevResidue = 2;
                        ssbegin = false;
                        ssend = false;
                    }
                    else if( (prevSS === 'sheet' && ss === 'helix') || (prevSS === 'helix' && ss === 'sheet')) {
                        bSetPrevResidue = 1;
                        ssbegin = true;
                        ssend = false;
                    }
                }
                else {
                        ssbegin = false;
                        ssend = false;
                }

                if(bSetPrevResidue == 1) { //1: reset previous residue to "ssbegin = true"
                    var prevResid = chainNum + '_' + (resi - 1).toString();
                    for(var j in me.icn3d.residues[prevResid]) {
                        me.icn3d.atoms[j].ssbegin = true;
                        me.icn3d.atoms[j].ssend = false;
                    }
                }
                else if(bSetPrevResidue == 2) { //2: reset previous residue to "ssend = true"
                    var prevResid = chainNum + '_' + (resi - 1).toString();
                    for(var j in me.icn3d.residues[prevResid]) {
                        me.icn3d.atoms[j].ssbegin = false;
                        me.icn3d.atoms[j].ssend = true;
                    }
                }

                // set the current residue
                for(var j in me.icn3d.residues[resid]) {
                    me.icn3d.atoms[j].ss = ss;
                    me.icn3d.atoms[j].ssbegin = ssbegin;
                    me.icn3d.atoms[j].ssend = ssend;
                }

                prevSS = ss;
              } // for each residue
          } // for each chain
        } // if no error

        me.loadPdbDataRender();

        if(me.deferredSecondary !== undefined) me.deferredSecondary.resolve();
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }

        me.loadPdbDataRender();
        if(me.deferredSecondary !== undefined) me.deferredSecondary.resolve();
        return;
      }
    });
};

iCn3DUI.prototype.loadPdbDataRender = function() {
    var me = this;

    me.pmid = me.icn3d.pmid;

    if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
        $("#" + me.pre + "alternateWrapper").hide();
    }

    me.icn3d.setAtomStyleByOptions(me.opts);
    me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);

    me.renderStructure();

    me.showTitle();

    if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

    if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3DUI.prototype.downloadCid = function (cid) { var me = this;
    var uri = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid + "/record/SDF/?record_type=3d&response_type=display";

    me.opts['pk'] = 'atom';
    me.opts['chemicals'] = 'ball and stick';

    me.icn3d.opts['pk'] = 'atom';
    me.icn3d.opts['chemicals'] = 'ball and stick';

    me.icn3d.bCid = true;

    $.ajax({
      url: uri,
      dataType: 'text',
      cache: true,
      tryCount : 0,
      retryLimit : 1,
      beforeSend: function() {
          me.showLoading();
      },
      complete: function() {
          me.hideLoading();
      },
      success: function(data) {
        var bResult = me.loadSdfAtomData(data, cid);

        if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
            $("#" + me.pre + "alternateWrapper").hide();
        }

        if(!bResult) {
          alert('The SDF of CID ' + cid + ' has the wrong format...');
        }
        else {

          me.icn3d.setAtomStyleByOptions(me.opts);
          me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);

          me.renderStructure();

          if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

          if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
        }
      },
      error : function(xhr, textStatus, errorThrown ) {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
            //try again
            $.ajax(this);
            return;
        }
        return;
      }
    })
    .fail(function() {
        alert( "This CID may not have 3D structure..." );
    });
};

iCn3DUI.prototype.loadSdfData = function(data) {
    var me = this;

    var bResult = me.loadSdfAtomData(data);

    if(me.cfg.align === undefined && Object.keys(me.icn3d.structures).length == 1) {
        $("#" + me.pre + "alternateWrapper").hide();
    }

    if(!bResult) {
      alert('The SDF file has the wrong format...');
    }
    else {
      me.icn3d.setAtomStyleByOptions(me.opts);
      me.icn3d.setColorByOptions(me.opts, me.icn3d.atoms);

      me.renderStructure();

      if(me.cfg.rotate !== undefined) me.rotStruc(me.cfg.rotate, true);

      if(me.deferred !== undefined) me.deferred.resolve(); if(me.deferred2 !== undefined) me.deferred2.resolve();
    }
};

iCn3DUI.prototype.loadSdfAtomData = function (data, cid) { var me = this;
    var lines = data.split(/\r?\n|\r/);
    if (lines.length < 4) return false;

    me.icn3d.init();

    var structure = cid ? cid : 1;
    var chain = 'A';
    var resi = 1;
    var resn = 'LIG';

    var moleculeNum = structure;
    var chainNum = structure + '_' + chain;
    var residueNum = chainNum + '_' + resi;

    var atomCount = parseInt(lines[3].substr(0, 3));
    if (isNaN(atomCount) || atomCount <= 0) return false;

    var bondCount = parseInt(lines[3].substr(3, 3));
    var offset = 4;
    if (lines.length < offset + atomCount + bondCount) return false;

    var start = 0;
    var end = atomCount;
    var i, line;

    var atomid2serial = {};
    var skipAtomids = {}; // skip hydrgen atom

    var AtomHash = {};
    var serial = 1;
    for (i = start; i < end; i++) {
        line = lines[offset];
        offset++;

        var name = line.substr(31, 3).replace(/ /g, "");

        if(name !== 'H') {
            var x = parseFloat(line.substr(0, 10));
            var y = parseFloat(line.substr(10, 10));
            var z = parseFloat(line.substr(20, 10));
            var coord = new THREE.Vector3(x, y, z);

            var atomDetails = {
                het: true,              // optional, used to determine chemicals, water, ions, etc
                serial: serial,         // required, unique atom id
                name: name,             // required, atom name
                resn: resn,             // optional, used to determine protein or nucleotide
                structure: structure,   // optional, used to identify structure
                chain: chain,           // optional, used to identify chain
                resi: resi,             // optional, used to identify residue ID
                coord: coord,           // required, used to draw 3D shape
                b: 0,                   // optional, used to draw B-factor tube
                elem: name,             // optional, used to determine hydrogen bond
                bonds: [],              // required, used to connect atoms
                ss: 'coil',             // optional, used to show secondary structures
                ssbegin: false,         // optional, used to show the beginning of secondary structures
                ssend: false,           // optional, used to show the end of secondary structures

                bondOrder: []           // optional, specific for chemicals
            };

            me.icn3d.atoms[serial] = atomDetails;
            AtomHash[serial] = 1;

            atomid2serial[i] = serial;

            ++serial;
        }
        else {
            skipAtomids[i] = 1;
        }
    }

    me.icn3d.dAtoms = AtomHash;
    me.icn3d.hAtoms= AtomHash;
    me.icn3d.structures[moleculeNum] = [chainNum]; //AtomHash;
    me.icn3d.chains[chainNum] = AtomHash;
    me.icn3d.residues[residueNum] = AtomHash;

    me.icn3d.residueId2Name[residueNum] = resn;

    if(me.icn3d.chainsSeq[chainNum] === undefined) me.icn3d.chainsSeq[chainNum] = [];
/*
    if(me.icn3d.chainsAn[chainNum] === undefined ) me.icn3d.chainsAn[chainNum] = [];
    if(me.icn3d.chainsAn[chainNum][0] === undefined ) me.icn3d.chainsAn[chainNum][0] = [];
    if(me.icn3d.chainsAnTitle[chainNum] === undefined ) me.icn3d.chainsAnTitle[chainNum] = [];
    if(me.icn3d.chainsAnTitle[chainNum][0] === undefined ) me.icn3d.chainsAnTitle[chainNum][0] = [];
*/
      var resObject = {};
      resObject.resi = resi;
      resObject.name = resn;

    me.icn3d.chainsSeq[chainNum].push(resObject);
//        me.icn3d.chainsAn[chainNum][0].push(resi);
//        me.icn3d.chainsAnTitle[chainNum][0].push('');

    for (i = 0; i < bondCount; i++) {
        line = lines[offset];
        offset++;
        var fromAtomid = parseInt(line.substr(0, 3)) - 1 + start;
        var toAtomid = parseInt(line.substr(3, 3)) - 1 + start;
        //var order = parseInt(line.substr(6, 3));
        var order = line.substr(6, 3).trim();

        if(!skipAtomids.hasOwnProperty(fromAtomid) && !skipAtomids.hasOwnProperty(toAtomid)) {
            var from = atomid2serial[fromAtomid];
            var to = atomid2serial[toAtomid];

            me.icn3d.atoms[from].bonds.push(to);
            me.icn3d.atoms[from].bondOrder.push(order);
            me.icn3d.atoms[to].bonds.push(from);
            me.icn3d.atoms[to].bondOrder.push(order);
            if(order == '2') {
                me.icn3d.doublebonds[from + '_' + to] = 1;
                me.icn3d.doublebonds[to + '_' + from] = 1;
            }
            else if(order == '3') {
                me.icn3d.triplebonds[from + '_' + to] = 1;
                me.icn3d.triplebonds[to + '_' + from] = 1;
            }
        }
    }

    me.setMaxD();

    me.showTitle();

    return true;
};

iCn3DUI.prototype.setMaxD = function () { var me = this;
    var pmin = new THREE.Vector3( 9999, 9999, 9999);
    var pmax = new THREE.Vector3(-9999,-9999,-9999);
    var psum = new THREE.Vector3();
    var cnt = 0;
    // assign atoms
    for (var i in me.icn3d.atoms) {
        var atom = me.icn3d.atoms[i];
        var coord = atom.coord;
        psum.add(coord);
        pmin.min(coord);
        pmax.max(coord);
        ++cnt;

        if(atom.het) {
          if($.inArray(atom.elem, me.icn3d.ionsArray) !== -1) {
            me.icn3d.ions[atom.serial] = 1;
          }
          else {
            me.icn3d.chemicals[atom.serial] = 1;
          }
        }
    } // end of for


    me.icn3d.pmin = pmin;
    me.icn3d.pmax = pmax;

    me.icn3d.cnt = cnt;

    me.icn3d.maxD = me.icn3d.pmax.distanceTo(me.icn3d.pmin);
    me.icn3d.center = psum.multiplyScalar(1.0 / me.icn3d.cnt);

    if (me.icn3d.maxD < 5) me.icn3d.maxD = 5;
    me.icn3d.oriMaxD = me.icn3d.maxD;
    me.icn3d.oriCenter = me.icn3d.center.clone();
};

/**
 * @author Jiyao Wang <wangjiy@ncbi.nlm.nih.gov> / https://github.com/ncbi/icn3d
 */

iCn3DUI.prototype.removeHlAll = function() { var me = this;
       me.removeHlObjects();
};

iCn3DUI.prototype.removeHlObjects = function() { var me = this;
       me.icn3d.removeHlObjects();
};

iCn3DUI.prototype.updateHlAll = function(commandnameArray, bSetMenu, bUnion) { var me = this;
       me.updateHlObjects();
};

iCn3DUI.prototype.updateHlObjects = function() { var me = this;
       me.icn3d.removeHlObjects();
       me.icn3d.addHlObjects();
};

iCn3DUI.prototype.toggleHighlight = function() { var me = this;
    //me.setLogCmd("toggle highlight", true);

    if(me.icn3d.prevHighlightObjects.length > 0 || me.icn3d.prevHighlightObjects_ghost.length > 0) { // remove
        me.clearHighlight();
    }
    else { // add
        me.showHighlight();
    }

    me.setLogCmd("toggle highlight", true);
};

iCn3DUI.prototype.clearHighlight = function() { var me = this;
    me.icn3d.labels['picking']=[];
    me.icn3d.draw();

    me.icn3d.removeHlObjects();
    me.icn3d.render();
};

iCn3DUI.prototype.showHighlight = function() { var me = this;
    me.icn3d.addHlObjects();
    me.updateHlAll();
    //me.bSelectResidue = true;
};

iCn3DUI.prototype.selectAChain = function (chainid, commandname, bAlign, bUnion) { var me = this;
    var commandname = commandname.replace(/\s/g, '');
    var command = 'select chain ' + chainid;

    //var residueHash = {}, chainHash = {};

    if(bUnion === undefined || !bUnion) {
        me.icn3d.hAtoms = {};
        me.menuHlHash = {};
    }
    else {
        me.icn3d.hAtoms = me.icn3d.unionHash(me.icn3d.hAtoms, me.icn3d.chains[chainid]);

        if(me.menuHlHash === undefined) me.menuHlHash = {};
    }

    me.menuHlHash[chainid] = 1;

    //chainHash[chainid] = 1;

    var chnsSeq = (bAlign) ? me.icn3d.alnChainsSeq[chainid] : me.icn3d.chainsSeq[chainid];

    var oriResidueHash = {};
    for(var i = 0, il = chnsSeq.length; i < il; ++i) { // get residue number
        var resObj = chnsSeq[i];
        var residueid = chainid + "_" + resObj.resi;

        var value = resObj.name;

        if(value !== '' && value !== '-') {
          oriResidueHash[residueid] = 1;
          for(var j in me.icn3d.residues[residueid]) {
            me.icn3d.hAtoms[j] = 1;
          }
        }
    }

    if((me.icn3d.defNames2Atoms === undefined || !me.icn3d.defNames2Atoms.hasOwnProperty(chainid)) && (me.icn3d.defNames2Residues === undefined || !me.icn3d.defNames2Residues.hasOwnProperty(chainid)) ) {
        me.addCustomSelection(Object.keys(oriResidueHash), commandname, commandname, command, true);
    }

    if(bAlign) {
        me.updateHlAll(undefined, undefined, bUnion);
    }
    else {
        me.updateHlAll(Object.keys(me.menuHlHash), undefined, bUnion);
    }

//        me.icn3d.addHlObjects();
//        me.updateHl2D(Object.keys(chainHash));
};
