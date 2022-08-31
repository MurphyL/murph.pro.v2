import { SQLEditor } from "../../layout/sql-kits-layout.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

export default function MySQL_DDL2X_Layout() {
    return (
        <Splitter>
            <SQLEditor />
        </Splitter>
    );
}