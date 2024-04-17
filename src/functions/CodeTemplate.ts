interface ProblemConfig {
  functionName: string
  returnType: string
  argumentTypes: string[]
  argumentNames: string[]
}

const cppTypeMap: { [key: string]: string } = {
  int: 'int',
  'int[]': 'vector<int>',
  'int[][]': 'vector<vector<int>>',
  string: 'string'
}

const javaTypeMap: { [key: string]: string } = {
  int: 'int',
  'int[]': 'List<int>'
}

export function getCppCodeTemplate(problemConfig: ProblemConfig) {
  const func: string = `${cppTypeMap[problemConfig.returnType]} ${problemConfig.functionName}`
  let args = ''
  for (let i = 0; i < problemConfig.argumentTypes.length; i++) {
    args =
      args +
      cppTypeMap[problemConfig.argumentTypes[i]] +
      ' ' +
      problemConfig.argumentNames[i] +
      ', '
  }
  args = args.slice(0, -2)

  return `class Solution {
public:
    ${func}(${args}) {
    
    }
};`
}
