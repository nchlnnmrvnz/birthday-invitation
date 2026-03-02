export type File = {
  type: "file";
  content?: string
};

export type Folder = {
  type: "folder";
  children: Record<string, File | Folder>;
};

export const fakeFS: Folder = {
  type: "folder",
  children: {
    "2026": {
      type: "folder",
      children: {
        January: {
          type: "folder",
          children: {
            "1.txt": { 
              type: "file"
            },
            "2.txt": { 
              type: "file"
            },
            "3.txt": { 
              type: "file"
            },
            "4.txt": { 
              type: "file"
            },
            "5.txt": { 
              type: "file"
            },
            "6.txt": { 
              type: "file"
            },
            "7.txt": { 
              type: "file"
            },
            "8.txt": { 
              type: "file"
            },
            "9.txt": { 
              type: "file"
            },
            "10.txt": { 
              type: "file"
            },
            "11.txt": { 
              type: "file"
            },
            "12.txt": { 
              type: "file"
            },
            "13.txt": { 
              type: "file"
            },
            "14.txt": { 
              type: "file"
            },
            "15.txt": { 
              type: "file"
            },
            "16.txt": { 
              type: "file"
            },
            "17.txt": { 
              type: "file"
            },
            "18.txt": { 
              type: "file"
            },
            "19.txt": { 
              type: "file"
            },
            "20.txt": { 
              type: "file"
            },
            "21.txt": { 
              type: "file"
            },
            "22.txt": { 
              type: "file"
            },
            "23.txt": { 
              type: "file"
            },
            "24.txt": { 
              type: "file"
            },
            "25.txt": { 
              type: "file"
            },
            "26.txt": { 
              type: "file"
            },
            "27.txt": { 
              type: "file"
            },
            "28.txt": { 
              type: "file"
            },
            "29.txt": { 
              type: "file"
            },
            "30.txt": { 
              type: "file"
            },
            "31.txt": { 
              type: "file"
            }
          },
        },
        February: {
          type: "folder",
          children: {
            "1.txt": { 
              type: "file"
            },
            "2.txt": { 
              type: "file"
            },
            "3.txt": { 
              type: "file"
            },
            "4.txt": { 
              type: "file"
            },
            "5.txt": { 
              type: "file"
            },
            "6.txt": { 
              type: "file"
            },
            "7.txt": { 
              type: "file"
            },
            "8.txt": { 
              type: "file"
            },
            "9.txt": { 
              type: "file"
            },
            "10.txt": { 
              type: "file"
            },
            "11.txt": { 
              type: "file"
            },
            "12.txt": { 
              type: "file"
            },
            "13.txt": { 
              type: "file"
            },
            "14.txt": { 
              type: "file"
            },
            "15.txt": { 
              type: "file"
            },
            "16.txt": { 
              type: "file"
            },
            "17.txt": { 
              type: "file"
            },
            "18.txt": { 
              type: "file"
            },
            "19.txt": { 
              type: "file"
            },
            "20.txt": { 
              type: "file"
            },
            "21.txt": { 
              type: "file"
            },
            "22.txt": { 
              type: "file"
            },
            "23.txt": { 
              type: "file"
            },
            "24.txt": { 
              type: "file"
            },
            "25.txt": { 
              type: "file"
            },
            "26.txt": { 
              type: "file"
            },
            "27.txt": { 
              type: "file"
            },
            "28.txt": { 
              type: "file"
            }
          },
        },
        March: {
          type: "folder",
          children: {
            "1.txt": { 
              type: "file"
            },
            "2.txt": { 
              type: "file"
            },
            "3.txt": { 
              type: "file"
            },
            "4.txt": { 
              type: "file"
            },
            "5.txt": { 
              type: "file"
            },
            "6.txt": { 
              type: "file"
            },
            "7.txt": { 
              type: "file"
            },
            "8.txt": { 
              type: "file"
            },
            "9.txt": { 
              type: "file"
            },
            "10.txt": { 
              type: "file"
            },
            "11.txt": { 
              type: "file"
            },
            "12.txt": { 
              type: "file"
            },
            "13.txt": { 
              type: "file"
            },
            "14.txt": { 
              type: "file"
            },
            "15.txt": { 
              type: "file"
            },
            "16.txt": { 
              type: "file"
            },
            "17.txt": { 
              type: "file"
            },
            "18.txt": { 
              type: "file"
            },
            "19.txt": { 
              type: "file"
            },
            "20.txt": { 
              type: "file"
            },
            "21.txt": { 
              type: "file"
            },
            "22.txt": { 
              type: "file"
            },
            "23.txt": { 
              type: "file"
            },
            "24.txt": { 
              type: "file"
            }
          },
        },
        "README.md": { 
          type: "file", 
          content: "This is the 2026 folder README" 
        },
      },
    },
  },
};