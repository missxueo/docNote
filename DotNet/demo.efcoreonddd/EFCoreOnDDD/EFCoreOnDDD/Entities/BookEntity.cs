using System;
using System.Collections.Generic;
using System.Text;

namespace EFCoreOnDDD.Entities
{
    class BookEntity
    {
        private BookEntity(string name)
        {
            Name = name;
        }

        public BookEntity(string name, AuthorInfo author,BookCatalogEntity catalog)
        {
            Name = name;
            Author = author;
            Catalog = catalog;
        }

        public string Name { get; }

        public AuthorInfo Author { get; private set; }

        public BookCatalogEntity Catalog { get; private set; }

        public EnumBookType Type { get; private set; }


        private IList<BookChapterEntity> _chapters = new List<BookChapterEntity>(); // back filed

        public IEnumerable<BookChapterEntity> Chapters => _chapters;


        private List<KeyWordInfo> _keyWords = new List<KeyWordInfo>();

        public IEnumerable<KeyWordInfo> KeyWords => _keyWords;

        public string BookCoverImage { get; private set; }

        public void SetCover(string path)
        {
            BookCoverImage = path;
        }
    }

    class AuthorInfo
    {
        public AuthorInfo(string name)
        {
            Name = name;
        }
        public string Name { get; }
    }

    enum EnumBookType
    {
        History,
        Law,
        IT,
    }

    class KeyWordInfo
    {
        public KeyWordInfo(string word)
        {
            Word = word;
        }

        public string Word { get; }
    }

}
