import React from 'react'
import './index.scss'
import classNames from 'classnames'
import marked from '../helpers/marked'
import textInsert from '../helpers/insertText'
import keydownListen from '../helpers/keydownListen'
import 'highlight.js/styles/tomorrow.css'
import '../fonts/iconfont.css'

class MdEditor extends React.Component {
  constructor(props) {
    super(props)

    this.$vm = null
    this.handleEditorRef = $vm => {
      this.$vm = $vm
    }

    this.state = {
      preview: true,
      expand: true,
      edit: !this.props.disabled,
      f_history: [],
      f_history_index: 0,
      line_index: 1
    }
  }

  static defaultProps = {
    placeholder: '',
    lineNum: true,
    fullscreenMarginTop: '0px',
    disabled: false,
  }

  componentDidMount() {
    keydownListen(this)
  }

  componentWillUpdate(props, state) {
    const { f_history } = this.state
    if (props.value && state.f_history.length === 0) {
      f_history.push(props.value)
      this.setState({
        f_history
      })
      this.handleLineIndex(props.value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.handleLineIndex(nextProps.value)
    }
  }

  // on change
  handleChange = e => {
    const value = e.target.value
    this.saveHistory(value)
    this.props.onChange(value)
  }

  // Insert
  insert = e => {
    const { $vm } = this
    const type = e.currentTarget ? e.currentTarget.getAttribute('data-type') : e
    textInsert($vm, type)
    this.props.onChange($vm.value)
    this.saveHistory($vm.value)
  }

  // Saveing history
  saveHistory(value) {
    let { f_history, f_history_index } = this.state
    window.clearTimeout(this.currentTimeout)
    this.currentTimeout = setTimeout(() => {

      if (f_history_index < f_history.length - 1) {
        f_history.splice(f_history_index + 1)
      }

      if (f_history.length >= 20) {
        f_history.shift()
      }

      f_history_index = f_history.length
      f_history.push(value)
      this.setState({
        f_history,
        f_history_index
      })
    }, 500)

    this.handleLineIndex(value)
  }

  handleLineIndex(value) {
    const line_index = value ? value.split('\n').length : 1
    this.setState({
      line_index
    })
  }

  undo = () => {
    const { f_history } = this.state
    let { f_history_index } = this.state
    f_history_index = f_history_index - 1
    if (f_history_index < 0) return
    this.setState({
      f_history_index
    })
    const value = f_history[f_history_index]

    this.props.onChange(value)
    this.handleLineIndex(value)
  }

  redo = () => {
    const { f_history } = this.state
    let { f_history_index } = this.state
    f_history_index = f_history_index + 1
    if (f_history_index >= f_history.length) return
    this.setState({
      f_history_index
    })
    const value = f_history[f_history_index]

    this.props.onChange(value)
    this.handleLineIndex(value)
  }


  preview = () => {
    this.setState({
      preview: !this.state.preview
    })
  }

  edit = () => {
    this.setState({
      edit: !this.state.edit
    })
  }

  expand = () => {
    this.setState({
      expand: !this.state.expand
    })
  }


  save = () => {
    this.props.onSave()
  }


  focusText = () => {
    const { $vm } = this
    $vm.focus()
  }

  render() {
    const { preview, expand, line_index, edit } = this.state
    const { value } = this.props
    const previewClass = classNames({
      'for-panel': true,
      'for-preview-hidden': !preview
    })
    const editorClass = classNames({
      'for-panel': true,
      'flex-0': !edit
    })
    const previewActive = classNames({
      'for-active': preview
    })
    const editActive = classNames({
      'for-active': edit,
    })
    const flexEnd = classNames({
      'flex-end': !edit
    })
    const firstSectionActive = classNames({
      'hidden': !edit
    })

    const fullscreen = classNames({
      'for-container': true,
      'for-fullscreen': expand
    })
    const expandActive = classNames({
      'for-active': expand
    })
    const lineNumStyles = classNames({
      'for-line-num': true,
      hidden: !this.props.lineNum
    })

    const lineNum = function() {
      const list = []
      for (let i = 0; i < line_index; i++) {
        list.push(<li key={i + 1}>{i + 1}</li>)
      }
      return <ul className={lineNumStyles}>{list}</ul>
    }

    return (
      <div className={fullscreen} style={{ height: this.props.height, marginTop: this.props.fullscreenMarginTop }}>
        <div className={"for-controlbar "+ flexEnd}>
          <ul className={firstSectionActive}>
            <li onClick={this.undo} title="Undo (ctrl+z)">
              <i className="foricon for-undo" />
            </li>
            <li onClick={this.redo} title="Redo (ctrl+y)">
              <i className="foricon for-redo" />
            </li>
            <li data-type="bold" onClick={this.insert} title="Bold">
              <strong>B</strong>
            </li>
            <li data-type="italic" onClick={this.insert} title="Italic">
              <i>I</i>
            </li>
            <li data-type="h1" onClick={this.insert} title="Heading 1">
              H1
            </li>
            <li data-type="h2" onClick={this.insert} title="Heading 2">
              H2
            </li>
            <li data-type="h3" onClick={this.insert} title="Heading 3">
              H3
            </li>
            <li data-type="h4" onClick={this.insert} title="Heading 4">
              H4
            </li>
            <li data-type="image" onClick={this.insert} title="Insert Image">
              <i className="foricon for-image" />
            </li>
            <li data-type="link" onClick={this.insert} title="Insert Link">
              <i className="foricon for-link" />
            </li>
            <li data-type="code" onClick={this.insert} title="Insert code">
              <i className="foricon for-code" />
            </li>
            <li onClick={this.save} title="Save (ctrl+s)">
              <i className="foricon for-save" />
            </li>
          </ul>
          <ul>
            {/* <li className={expandActive} onClick={this.expand}>
              {expandActive ? (
                <i className="foricon for-contract" />
              ) : (
                <i className="foricon for-expand" />
              )}
            </li> */}
            <li onClick={this.edit} className={editActive}><strong>Write</strong></li>
            <li className={previewActive} onClick={this.preview}>
              {previewActive ? (
                <i className="foricon for-eye-off" />
              ) : (
                <i className="foricon for-eye" />
              )}
            </li>
          </ul>
        </div>
        <div className="for-editor">
          <div className={editorClass} tabIndex="-1" onFocus={this.focusText}>
            <div className="for-editor-wrapper">
              <div className="for-editor-block">
                {lineNum()}
                <div className="for-editor-content">
                  <pre>{value} </pre>
                  <textarea
                    ref={this.handleEditorRef}
                    value={value}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder}
                    disabled = {!this.state.edit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={previewClass}>
            <div
              className="for-preview for-markdown-preview"
              dangerouslySetInnerHTML={{ __html: marked(value) }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default MdEditor
