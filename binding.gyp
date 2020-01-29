{
  'targets': [
    {
    'target_name': 'parquet',
    'sources': [
      'src/parquet_binding.cc',
      'src/parquet_reader.cc',
      'src/parquet_writer.cc',
    ],
    'include_dirs': [
      "deps/parquet-cpp/src",
      "build_deps/parquet-cpp/release/include",
      "<!(node -e \"require('nan')\")"
    ],
    'cflags!': [ '-fno-exceptions', '-static', '-fPIC' ],
    'cflags_cc!': [ '-fno-exceptions', '-static', '-fPIC' ],
    'conditions': [
      ['OS=="mac"', {
      'xcode_settings': {
       'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
      },
      'libraries': [
      '-w',
      '<(module_root_dir)/release/mac/libparquet.a',
      '<(module_root_dir)/release/mac/libarrow.a',
      '<(module_root_dir)/release/mac/libsnappy.a',
      '<(module_root_dir)/release/mac/libbrotlidec.a',
      '<(module_root_dir)/release/mac/libbrotlienc.a',
      '<(module_root_dir)/release/mac/libbrotlicommon.a',
      '<(module_root_dir)/release/mac/libthrift.a',
      '<(module_root_dir)/release/mac/libboost_regex.a',
      ],
    },
    'OS=="linux"', {
      'libraries': [
      '<(module_root_dir)/release/linux/libparquet.a',
      '<(module_root_dir)/release/linux/libarrow.a',
      '<(module_root_dir)/release/linux/libsnappy.a',
      '<(module_root_dir)/release/linux/libbrotlidec.a',
      '<(module_root_dir)/release/linux/libbrotlienc.a',
      '<(module_root_dir)/release/linux/libbrotlicommon.a',
      '<(module_root_dir)/release/linux/libthrift.a',
      '-lboost_regex',
      ],
    }]
    ]
  }
  ]
}
