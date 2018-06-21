export const MODE = {
  REWRITE: 'REWRITE',
  APPEND: 'APPEND',
}

export const AUTH_PREFIX = {
  L1:{
    INTERNAL: 'apex_l1_ig',
    EXTERNAL: 'apex_l1_eg',
  },
  L2:{
    INTERNAL: 'apex_l2_ig',
    EXTERNAL: 'apex_l2_eg',
  }
}

export const DEFAULT_MODE = MODE.REWRITE;