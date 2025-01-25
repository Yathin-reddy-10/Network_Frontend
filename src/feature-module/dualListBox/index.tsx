import React, { useEffect, useState } from 'react';

interface Option {
  id: number;
  name: string;
}

export interface DualListBoxProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
}

const DualListBox: React.FC<DualListBoxProps> = ({ options, selected, onChange }) => {
  const [availablePermissions, setAvailablePermissions] = useState<Option[]>([]);
  const [chosenPermissions, setChosenPermissions] = useState<Option[]>(selected);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');

  useEffect(() => {
    if (Array.isArray(options)) {
      const selectedIds = new Set(selected.map(item => item.id));
      setAvailablePermissions(options.filter(item => !selectedIds.has(item.id)));
      setChosenPermissions(selected);
    }
  }, [options, selected]);

  const moveToChosen = (id: number) => {
    const permission = availablePermissions.find(perm => perm.id === id);
    if (permission) {
      setChosenPermissions([...chosenPermissions, permission]);
      setAvailablePermissions(availablePermissions.filter(perm => perm.id !== id));
      onChange([...chosenPermissions, permission]);
    }
  };

  const moveToAvailable = (id: number) => {
    const permission = chosenPermissions.find(perm => perm.id === id);
    if (permission) {
      setAvailablePermissions([...availablePermissions, permission]);
      setChosenPermissions(chosenPermissions.filter(perm => perm.id !== id));
      onChange(chosenPermissions.filter(perm => perm.id !== id));
    }
  };

  const moveAllToChosen = () => {
    const filteredLeftList = availablePermissions.filter(item => item.name.toLowerCase().includes(searchLeft.toLowerCase()));
    setChosenPermissions([...chosenPermissions, ...filteredLeftList]);
    setAvailablePermissions(availablePermissions.filter(item => !filteredLeftList.includes(item)));
    onChange([...chosenPermissions, ...filteredLeftList]);
  };

  const moveAllToAvailable = () => {
    const filteredRightList = chosenPermissions.filter(item => item.name.toLowerCase().includes(searchRight.toLowerCase()));
    setAvailablePermissions([...availablePermissions, ...filteredRightList]);
    setChosenPermissions(chosenPermissions.filter(item => !filteredRightList.includes(item)));
    onChange(chosenPermissions.filter(item => !filteredRightList.includes(item)));
  };

  const filteredLeftList = availablePermissions.filter(item => item.name.toLowerCase().includes(searchLeft.toLowerCase()));
  const filteredRightList = chosenPermissions.filter(item => item.name.toLowerCase().includes(searchRight.toLowerCase()));

  const styles: { [key: string]: React.CSSProperties } = {
    dualListBox: { display: 'flex', justifyContent: 'space-between', padding: '10px' },
    listContainer: { width: '45%', border: '1px solid #ccc', borderRadius: '4px', padding: '5px', boxSizing: 'border-box' as 'border-box', textAlign: 'center' },
    list: { listStyleType: 'none', padding: 0, margin: 0, height: '300px', overflowY: 'scroll' }, // Increased height
    listItem: { padding: '8px', cursor: 'pointer', margin: '1px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    evenItem: { backgroundColor: '#f9f9f9' },
    oddItem: { backgroundColor: '#ffffff' },
    arrow: { marginLeft: '5px' },
    searchInput: { width: '100%', padding: '8px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' as 'border-box' },
    buttonContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' },
    button: { margin: '5px', cursor: 'pointer' },
    itemCount: { fontSize: '12px', textAlign: 'center', marginTop: '5px' },
  };

  return (
    <div className="dual-list-box" style={styles.dualListBox}>
      <div className="list-container" style={styles.listContainer}>
        <label className="form-label">Available Permissions</label>
        <input
          type="text"
          placeholder="Search..."
          value={searchLeft}
          onChange={(e) => setSearchLeft(e.target.value)}
          style={styles.searchInput}
        />
        <ul style={styles.list}>
          {filteredLeftList.map((item, index) => (
            <li
              key={item.id}
              onClick={() => moveToChosen(item.id)}
              style={{ ...styles.listItem, ...(index % 2 === 0 ? styles.evenItem : styles.oddItem) }}
            >
              {item.name} <span style={styles.arrow}><i className='far fa-hand-point-right' style={{ fontSize: '24px' }}></i></span>
            </li>
          ))}
        </ul>
        <div style={styles.itemCount}>Items: {filteredLeftList.length}</div>
      </div>
      <div style={styles.buttonContainer}>
        <button type="button" style={styles.button} onClick={moveAllToChosen}>
          <i className='far fa-hand-point-right' style={{ fontSize: '24px' }}></i>
        </button>
        <button type="button" style={styles.button} onClick={moveAllToAvailable}>
          <i className='far fa-hand-point-left' style={{ fontSize: '24px' }}></i>
        </button>
      </div>
      <div className="list-container" style={styles.listContainer}>
        <label className="form-label">Chosen Permissions</label>
        <input
          type="text"
          placeholder="Search..."
          value={searchRight}
          onChange={(e) => setSearchRight(e.target.value)}
          style={styles.searchInput}
        />
        <ul style={styles.list}>
          {filteredRightList.map((item, index) => (
            <li
              key={item.id}
              onClick={() => moveToAvailable(item.id)}
              style={{ ...styles.listItem, ...(index % 2 === 0 ? styles.evenItem : styles.oddItem) }}
            >
              <span style={styles.arrow}><i className='far fa-hand-point-left' style={{ fontSize: '24px' }}></i></span>{item.name}
            </li>
          ))}
        </ul>
        <div style={styles.itemCount}>Items: {filteredRightList.length}</div>
      </div>
    </div>
  );
};

export default DualListBox;
