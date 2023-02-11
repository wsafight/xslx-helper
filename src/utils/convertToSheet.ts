export const enum SheetValType {
  Number = 'n',
  Boolean = 'b',
  String = 's',
  Date = 'd',
  Error = 'e',
}

interface Options {
  skipHeader?: boolean
  header?: string[]
  nullIsError?: boolean
}

const keys = (val: Record<string, any>) => {
  return Object.keys(val).filter((item) =>
    Object.prototype.hasOwnProperty.call(val, item)
  )
}

const getType = (val: any): string => {
  if (typeof val === 'string') {
    return SheetValType['String']
  }

  if (typeof val === 'number') {
    return SheetValType.Number
  }

  if (typeof val === 'boolean') {
    return SheetValType.Boolean
  }

  return ''
}

function encodeCell(cell: any): string {
  var col = cell.c + 1
  var s = ''
  for (; col; col = ((col - 1) / 26) | 0)
    s = String.fromCharCode(((col - 1) % 26) + 65) + s
  return s + (cell.r + 1)
}

export const json2Sheet = (data: any[], opts: Options = {}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null
  }

  const { header = [] } = opts

  // const _row = []

  const headTitle: string[] = header

  const sheetObj: Record<string, any> = {}

  let rowCursor = 0

  var offset: number = +!opts.skipHeader

  const maxRowCount: number = offset + data.length

  data.forEach((item, index) => {
    const currentRowCursor = rowCursor + index + offset
    const currentRow = sheetObj[currentRowCursor]
    if (!currentRow) {
      sheetObj[currentRowCursor] = []
    }

    keys(item).forEach((key) => {
      let currentIndex = headTitle.indexOf(key)

      if (currentIndex === -1) {
        currentIndex = headTitle.length
        headTitle[currentIndex] = key
      }

      const ref = encodeCell({
        c: currentIndex,
        r: currentRowCursor,
      })

      const val = item[key]
      const type = getType(val)

      sheetObj[ref] = {
        t: type,
        v: val,
      }
    })
  })

  // TODO
  //  const _maxColumnCxsount = headTitle.length;

  sheetObj['!ref'] = `A!:B${maxRowCount}`

  console.log('sheetObj', sheetObj)
  //  return sheetObj

  return {
    '!cols': undefined,
    '!ref': 'A!:B2',
    A1: {
      t: 's',
      v: 'name',
    },
    A2: {
      t: 's',
      v: 'jump_jump',
    },
    B1: {
      t: 's',
      v: 'age',
    },
    B2: {
      t: 'n',
      v: 18,
    },
  }
}
