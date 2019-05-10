function insert($vm, prefix, hint = '', subfix = '') {
  const value = $vm.value
  if ($vm.selectionStart || $vm.selectionStart === 0) {
    let start = $vm.selectionStart
    let end = $vm.selectionEnd

    const restoreTop = $vm.scrollTop

    if (start === end) {
      $vm.value =
        value.substring(0, start) +
        prefix +
        hint +
        subfix +
        value.substring(end, value.length)
      $vm.selectionStart = start + prefix.length
      $vm.selectionEnd = end + prefix.length + hint.length
    } else {
      $vm.value =
        value.substring(0, start) +
        prefix +
        value.substring(start, end) +
        subfix +
        value.substring(end, value.length)
      $vm.selectionStart = start + prefix.length
      $vm.selectionEnd = end + prefix.length
    }

    $vm.focus()
    if (restoreTop >= 0) {
      $vm.scrollTop = restoreTop
    }
  }
}

const toolbar = {
  h1($vm) {
    insert($vm, '# ', '')
  },
  h2($vm) {
    insert($vm, '## ', '')
  },
  h3($vm) {
    insert($vm, '### ', '')
  },
  h4($vm) {
    insert($vm, '#### ', '')
  },
  image($vm) {
    insert($vm, '![alt](', 'url', ')')
  },
  link($vm) {
    insert($vm, '[title](', 'url', ')')
  },
  code($vm) {
    insert($vm, '```', 'language', '\n\n```')
  },
  tab($vm) {
    insert($vm, '  ')
  },
  bold($vm){
    insert($vm, '**','','**')
  },
  italic($vm){
    insert($vm, '*','','*')
  }
}

export default ($vm, type) => {
  return toolbar[type]($vm)
}
