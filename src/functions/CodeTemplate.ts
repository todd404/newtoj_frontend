interface ProblemConfig {
  functionName: string
  returnType: string
  argumentTypeList: string[]
  argumentNameList: string[]
}

const cppTypeMap: { [key: string]: string } = {
  int: 'int',
  'int[]': 'vector<int>',
  'int[][]': 'vector<vector<int>>',
  string: 'string'
}

const javaTypeMap: { [key: string]: string } = {
  int: 'int',
  'int[]': 'int[]',
  'int[][]': 'int[][]',
  string: 'String'
}

export function getCppCodeTemplate(problemConfig: ProblemConfig) {
  const func: string = `${cppTypeMap[problemConfig.returnType]} ${problemConfig.functionName}`
  let args = ''
  for (let i = 0; i < problemConfig.argumentTypeList.length; i++) {
    args =
      args +
      cppTypeMap[problemConfig.argumentTypeList[i]] +
      ' ' +
      problemConfig.argumentNameList[i] +
      ', '
  }
  args = args.slice(0, -2)

  return `class Solution {
public:
    ${func}(${args}) {
    
    }
};`
}

export function getJavaCodeTemplate(problemConfig: ProblemConfig) {
  const func: string = `${javaTypeMap[problemConfig.returnType]} ${problemConfig.functionName}`
  let args = ''
  for (let i = 0; i < problemConfig.argumentTypeList.length; i++) {
    args =
      args +
      javaTypeMap[problemConfig.argumentTypeList[i]] +
      ' ' +
      problemConfig.argumentNameList[i] +
      ', '
  }

  args = args.slice(0, -2)

  return `class Solution {
  public ${func}(${args}) {
    
  }
}`
}
