/**
 * BLOCK: display A Author bio
 *
 * Styles:
 *        editor.css — Editor styles for the block.
 *        style.css — Frontend styles for the block.
 */
( function() {
	var __ = wp.i18n.__; // The __() for internationalization.
	var el = wp.element.createElement; // The wp.element.createElement() function to create elements.
	var Editable = wp.blocks.Editable; // Editable component of React.
	const { registerBlockType, InspectorControls } = wp.blocks;
        const { Component } = wp.element;
        const { SelectControl } = wp.components;
        
        
        class mySelectAuthor extends Component {
            static getInitialState( selectedAuthor ) {
                return {
                    authors: [ ],
                    selectedAuthor: selectedAuthor,
                    post: { },
                };
            }
            
            // Constructing our component. With super() we are setting everything to 'this'.
            // Now we can access the attributes with this.props.attributes
            constructor() {
                super( ...arguments );
                // Maybe we have a previously selected post. Try to load it.
                this.state = this.constructor.getInitialState( this.props.attributes.selectedAuthor );
                // Bind so we can use 'this' inside the method.
                this.getOptions = this.getOptions.bind(this);
                
                this.onChangeSelectAuthor = this.onChangeSelectAuthor.bind(this);
                 
                // Load authors.
                this.getOptions();
            }
            
            onChangeSelectAuthor( value ) {
                // Find the author
                const author = this.state.authors.find( ( item ) => { return item.id == parseInt( value ) } );
                // Set the state
                this.setState( { selectedAuthor: parseInt( value ), author } );
                // Set the attributes
                this.props.setAttributes( {     
                  selectedAuthor: parseInt( value ),
                  name: author.name,
                  description: author.description,
                  profilePic: author.avatar_urls['96'],
                  link: author.link,
                });
            }
            
            /**
            * Loading authors
            */
            getOptions() {
              return ( new wp.api.collections.Users() ).fetch().then( ( authors ) => {
                if( authors && 0 !== this.state.selectedAuthor ) {
                  // If we have a selected Author, find that Author and add it.
                  const author = authors.find( ( item ) => { return item.id == this.state.selectedAuthor } );
                  this.setState( { author, authors } );
                } else {
                  this.setState({ authors });
                }
              });
            } 
  
            render() {
                let options = [ { value: 0, label: __( 'Select a Author' ) } ];
                let output = __( 'Loading Authors' );
                this.props.className += ' loading';
                if ( this.state.authors.length > 0 ) {
                    const loading = __( 'We have %d Authors. Choose one.' );
                    output = loading.replace( '%d', this.state.authors.length );
                    
                    this.state.authors.forEach( ( author ) => {
                        options.push( { value: author.id, label: author.name } );
                    } );
                } else {
                    output = __( 'No Author found.' );
                }
                
                return [
                    !!this.props.focus && ( <InspectorControls key='inspector'>
                      <SelectControl onChange={this.onChangeSelectAuthor} value={ this.props.attributes.selectedAuthor } label={ __( 'Select a Author' ) } options={ options } />
                     </InspectorControls>
                        ),
                    output
                ]
            }
        }

	/**
	 * Register The Block.
	 *
	 * Registers a new block provided a unique name and an object defining its
	 * behavior. Once registered, the block is made available as an option to any
	 * editor interface where blocks are implemented.
	 *
	 * @param  {string}   name     Block name.
	 * @param  {Object}   settings Block settings.
	 * @return {?WPBlock}          The block, if it has been successfully
	 *                             registered; otherwise `undefined`.
	 */
	registerBlockType( 'rtgb/author-bio', { // Block name.
		title: __( 'Author Bio' ), // Block title.
		icon: 'shield', // Block icon 
		category: 'common', // Block category
                keywords: [
                    __( 'Athor' ),
                    __( 'Author Bio' ),
                    __( 'guten-author-bio' ),
                ],
                attributes: {
                    description: {
                      type: 'array',
                      source: 'children',
                      selector: 'p',
                    },
                    profilePic: {
                      type: 'string',
                      selector: 'img'
                    },
                    name: {
                      type: 'string',
                      selector: 'h2'
                    },
                    link: {
                      type: 'string',
                      selector: 'a'
                    },
                    selectedAuthor: {
                      type: 'number',
                      default: 0,
                    },
                },
                
                edit: mySelectAuthor,
                
                // The "save" property must be specified and must be a valid function.
		save: function( props ) {
                    return (
                        <div className={ props.className }>
                          <div className="post">
                            <a href={ props.attributes.link }>
                            <img src={ props.attributes.profilePic }/>
                            <h4 dangerouslySetInnerHTML={ { __html: props.attributes.name } }></h4></a>
                            <p dangerouslySetInnerHTML={ { __html: props.attributes.description } }></p>
                          </div>
                        </div>
                    );
		},
	} );
        
} )();
