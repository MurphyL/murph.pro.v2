## Reference

- [Nginx - Full Example Configuration](https://www.nginx.com/resources/wiki/start/topics/examples/full/)
- [Tangled tree visualization](https://observablehq.com/@nitaku/tangled-tree-visualization-ii)

## Extra

```sh
python3 -m pip install install -r requirements.txt
```

## 查询文件

```graphql
query {
  repository(name: "murph.pro.v2", owner: "MurphyL") {
    name
    object(expression: "HEAD:src/core") {
      ... on Tree {
        entries {
          oid
          path
          object {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
}
```