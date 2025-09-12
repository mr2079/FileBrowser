import { Link } from "react-router";
import type { DirectoryItem } from "./DirectoryListItemComponent";
import DirectoryListItemComponent from "./DirectoryListItemComponent";

type Props = {
  previousDirectory: string | null;
  items: DirectoryItem[];
};

export default function DirectoryListComponent({
  previousDirectory,
  items,
}: Props) {
  return (
    <div className="file-manager-container file-manager-col-view">
      <div className="file-manager-row-header">
        <div className="file-item-name pb-2">Filename</div>
        <div className="file-item-changed pb-2">Changed</div>
      </div>

      {previousDirectory && (
        <div className="file-item">
          <div className="file-item-icon file-item-level-up fas fa-level-up-alt text-secondary"></div>
          <Link className="file-item-name" to={previousDirectory ?? "/"}>
            ..
          </Link>
        </div>
      )}

      {items.map((item, index) => (
        <DirectoryListItemComponent key={index} item={item} />
      ))}
    </div>
  );
}
