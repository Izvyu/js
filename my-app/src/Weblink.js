import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const Weblink = () => {
  const links = [
    { name: "請購未轉採購報表", url: "https://mj.mornjoy.com.tw/purchase/PurchaseRecords?solo=true", category: "採購" },
    { name: "收貨時間報表", url: "https://mj.mornjoy.com.tw/purchase/ReceipttimeRecords?solo=true", category: "採購" },
    { name: "庫存查詢報表", url: "https://mj.mornjoy.com.tw/purchase/StockRecords?solo=true", category: "庫存" },
    { name: "總務庫存查詢報表", url: "https://mj.mornjoy.com.tw/purchase/GeneralStockRecords?solo=true", category: "庫存" },
  ];

  const [category, setCategory] = useState('全部');

  const filteredLinks = links.filter(link =>
    category === '全部' || link.category === category
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1565c0', mb: 3 }}>
            🔗 集團報表入口
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>分類</InputLabel>
            <Select
              value={category}
              label="分類"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="全部">全部</MenuItem>
              <MenuItem value="採購">採購</MenuItem>
              <MenuItem value="庫存">庫存</MenuItem>
            </Select>
          </FormControl>

          <List>
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#e3f2fd',
                      transition: '0.3s',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={link.name}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#0d47a1',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                沒有符合的報表
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Weblink;