module.exports = elementorModules.ViewModule.extend( {
	getDefaultSettings() {
		return {
			element: null,
			direction: elementorFrontend.config.is_rtl ? 'right' : 'left',
			selectors: {
				container: window,
			},
			considerScrollbar: false,
			cssOutput: 'inline',
		};
	},

	getDefaultElements() {
		return {
			$element: jQuery( this.getSettings( 'element' ) ),
		};
	},

	stretch() {
		const settings = this.getSettings();

		let $container;

		try {
			$container = jQuery( settings.selectors.container );
			// eslint-disable-next-line no-empty
		} catch ( e ) {}

		if ( ! $container || ! $container.length ) {
			$container = jQuery( this.getDefaultSettings().selectors.container );
		}

		this.reset();

		var $element = this.elements.$element,
			containerWidth = $container.innerWidth(),
			elementOffset = $element.offset().left,
			isFixed = 'fixed' === $element.css( 'position' ),
			correctOffset = isFixed ? 0 : elementOffset,
			isContainerFullScreen = window === $container[ 0 ];

		if ( ! isContainerFullScreen ) {
			var containerOffset = $container.offset().left;

			if ( isFixed ) {
				correctOffset = containerOffset;
			}
			if ( elementOffset > containerOffset ) {
				correctOffset = elementOffset - containerOffset;
			}
		}

		if ( settings.considerScrollbar && isContainerFullScreen ) {
			const scrollbarWidth = window.innerWidth - containerWidth;
			correctOffset -= scrollbarWidth;
		}

		if ( ! isFixed ) {
			if ( elementorFrontend.config.is_rtl ) {
				correctOffset = containerWidth - ( $element.outerWidth() + correctOffset );
			}

			correctOffset = -correctOffset;
		}

		// Consider margin
		if ( settings.margin ) {
			correctOffset += settings.margin;
		}

		var css = {};

		let width = containerWidth;

		if ( settings.margin ) {
			width -= settings.margin * 2;
		}

		css.width = width + 'px';

		css[ settings.direction ] = correctOffset + 'px';

		if ( 'variables' === settings.cssOutput ) {
			this.applyCssVariables( $element, css );
			return;
		}

		$element.css( css );
	},

	reset() {
		var css = {};

		css.width = '';

		css[ this.getSettings( 'direction' ) ] = '';

		this.elements.$element.css( css );
	},

	applyCssVariables( $element, css ) {
		$element.css( '--stretch-width', css.width );

		if ( !! css.left ) {
			$element.css( '--stretch-left', css.left );
		} else {
			$element.css( '--stretch-right', css.right );
		}
	},
} );
